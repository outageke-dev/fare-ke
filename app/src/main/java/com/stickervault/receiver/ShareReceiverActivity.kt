package com.stickervault.receiver

import android.content.ClipData
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.lifecycle.lifecycleScope
import com.stickervault.db.Sticker
import com.stickervault.db.StickerDatabase
import com.stickervault.storage.StickerStorage
import kotlinx.coroutines.launch
import java.io.File

class ShareReceiverActivity : ComponentActivity() {
    private lateinit var db: StickerDatabase
    private lateinit var storage: StickerStorage

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        db = StickerDatabase.getDatabase(this)
        storage = StickerStorage(this)

        when {
            intent?.action == Intent.ACTION_SEND -> {
                handleSingleShare(intent)
            }
            intent?.action == Intent.ACTION_SEND_MULTIPLE -> {
                handleMultipleShare(intent)
            }
            else -> {
                finish()
            }
        }
    }

    private fun handleSingleShare(intent: Intent) {
        val imageUri: Uri? = intent.getParcelableExtra(Intent.EXTRA_STREAM)
        if (imageUri != null) {
            lifecycleScope.launch {
                try {
                    val savedFilename = storage.saveImageFromUri(imageUri)
                    val sticker = Sticker(
                        filename = savedFilename,
                        tags = extractTagsFromIntent(intent)
                    )
                    db.stickerDao().insertSticker(sticker)

                    Toast.makeText(
                        this@ShareReceiverActivity,
                        "Sticker saved!",
                        Toast.LENGTH_SHORT
                    ).show()
                } catch (e: Exception) {
                    Toast.makeText(
                        this@ShareReceiverActivity,
                        "Failed to save sticker: ${e.message}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                finish()
            }
        } else {
            finish()
        }
    }

    private fun handleMultipleShare(intent: Intent) {
        val clipData: ClipData? = intent.clipData
        if (clipData != null && clipData.itemCount > 0) {
            lifecycleScope.launch {
                var successCount = 0
                for (i in 0 until clipData.itemCount) {
                    val imageUri = clipData.getItemAt(i).uri
                    try {
                        val savedFilename = storage.saveImageFromUri(imageUri)
                        val sticker = Sticker(
                            filename = savedFilename,
                            tags = extractTagsFromIntent(intent)
                        )
                        db.stickerDao().insertSticker(sticker)
                        successCount++
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
                Toast.makeText(
                    this@ShareReceiverActivity,
                    "$successCount stickers saved!",
                    Toast.LENGTH_SHORT
                ).show()
                finish()
            }
        } else {
            finish()
        }
    }

    private fun extractTagsFromIntent(intent: Intent): String {
        val subject = intent.getStringExtra(Intent.EXTRA_SUBJECT) ?: ""
        val text = intent.getStringExtra(Intent.EXTRA_TEXT) ?: ""
        return listOf(subject, text).filter { it.isNotEmpty() }.joinToString(",")
    }
}
