package com.stickervault.ui

import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.view.View
import android.widget.Button
import android.widget.GridView
import android.widget.LinearLayout
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.stickervault.db.StickerDatabase
import com.stickervault.storage.StickerStorage
import com.stickervault.ui.adapter.StickerGridAdapter
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {
    private lateinit var db: StickerDatabase
    private lateinit var storage: StickerStorage
    private lateinit var stickerGrid: GridView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        db = StickerDatabase.getDatabase(this)
        storage = StickerStorage(this)

        val rootLayout = LinearLayout(this).apply {
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT
            )
            orientation = LinearLayout.VERTICAL
        }

        // Header with settings button
        val headerLayout = LinearLayout(this).apply {
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
            orientation = LinearLayout.HORIZONTAL
        }

        val enableButton = Button(this).apply {
            text = "Enable IME"
            layoutParams = LinearLayout.LayoutParams(
                0,
                LinearLayout.LayoutParams.WRAP_CONTENT,
                1f
            )
            setOnClickListener { openIMESettings() }
        }

        val clearButton = Button(this).apply {
            text = "Clear All"
            layoutParams = LinearLayout.LayoutParams(
                0,
                LinearLayout.LayoutParams.WRAP_CONTENT,
                1f
            )
            setOnClickListener { clearAllStickers() }
        }

        headerLayout.addView(enableButton)
        headerLayout.addView(clearButton)
        rootLayout.addView(headerLayout)

        // Sticker grid
        stickerGrid = GridView(this).apply {
            numColumns = 4
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT
            )
        }
        rootLayout.addView(stickerGrid)

        setContentView(rootLayout)

        loadStickers()
    }

    private fun loadStickers() {
        lifecycleScope.launch {
            db.stickerDao().getAllStickers().collect { stickers ->
                val adapter = StickerGridAdapter(
                    context = this@MainActivity,
                    stickers = stickers,
                    storage = storage,
                    onStickerClick = { /* click handled in IME */ }
                )
                stickerGrid.adapter = adapter
            }
        }
    }

    private fun openIMESettings() {
        startActivity(Intent(Settings.ACTION_INPUT_METHOD_SETTINGS))
    }

    private fun clearAllStickers() {
        lifecycleScope.launch {
            try {
                val allStickers = db.stickerDao().getAllStickers()
                allStickers.collect { stickers ->
                    stickers.forEach { sticker ->
                        db.stickerDao().deleteSticker(sticker)
                        storage.deleteStickerFile(sticker.filename)
                    }
                    Toast.makeText(this@MainActivity, "All stickers cleared", Toast.LENGTH_SHORT)
                        .show()
                }
                loadStickers()
            } catch (e: Exception) {
                Toast.makeText(this@MainActivity, "Error clearing stickers: ${e.message}", Toast.LENGTH_SHORT)
                    .show()
            }
        }
    }
}
