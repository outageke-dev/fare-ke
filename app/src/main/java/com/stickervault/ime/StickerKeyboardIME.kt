package com.stickervault.ime

import android.content.ClipData
import android.content.ClipData.Item
import android.content.ClipDescription
import android.content.ClipboardManager
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.inputmethodservice.InputMethodService
import android.net.Uri
import android.view.View
import android.view.inputmethod.InputConnection
import android.widget.GridView
import android.widget.LinearLayout
import androidx.lifecycle.lifecycleScope
import com.stickervault.db.Sticker
import com.stickervault.db.StickerDatabase
import com.stickervault.storage.StickerStorage
import com.stickervault.ui.adapter.StickerGridAdapter
import kotlinx.coroutines.launch
import java.io.File

class StickerKeyboardIME : InputMethodService() {
    private lateinit var db: StickerDatabase
    private lateinit var storage: StickerStorage
    private lateinit var clipboardManager: ClipboardManager

    private var stickerGridView: GridView? = null
    private var stickers: List<Sticker> = emptyList()

    override fun onCreate() {
        super.onCreate()
        db = StickerDatabase.getDatabase(this)
        storage = StickerStorage(this)
        clipboardManager = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
    }

    override fun onCreateInputView(): View {
        val rootView = LinearLayout(this).apply {
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT
            )
            orientation = LinearLayout.VERTICAL
        }

        stickerGridView = GridView(this).apply {
            numColumns = 4
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT
            )
        }

        rootView.addView(stickerGridView)

        lifecycleScope.launch {
            db.stickerDao().getAllStickers().collect { stickerList ->
                stickers = stickerList
                updateStickerGrid()
            }
        }

        return rootView
    }

    private fun updateStickerGrid() {
        stickerGridView?.let { grid ->
            val adapter = StickerGridAdapter(
                context = this,
                stickers = stickers,
                storage = storage,
                onStickerClick = { sticker -> insertSticker(sticker) }
            )
            grid.adapter = adapter
        }
    }

    private fun insertSticker(sticker: Sticker) {
        val ic = currentInputConnection ?: return

        val file = storage.getStickerFile(sticker.filename)
        if (!file.exists()) return

        // Try to use commitContent() for compatible apps
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
            if (commitContentViaCommitContent(ic, file)) {
                lifecycleScope.launch {
                    db.stickerDao().incrementUsage(sticker.id)
                }
                return
            }
        }

        // Fallback: copy to clipboard
        copyToClipboard(file)
        lifecycleScope.launch {
            db.stickerDao().incrementUsage(sticker.id)
        }
    }

    private fun commitContentViaCommitContent(ic: InputConnection, file: File): Boolean {
        return try {
            val bitmap = BitmapFactory.decodeFile(file.absolutePath)
            val contentUri = file.absolutePath.toUri()

            val inputContentInfo = android.view.inputmethod.InputContentInfo(
                contentUri,
                ClipDescription("image/webp", arrayOf("image/webp")),
                null
            )

            ic.commitContent(
                inputContentInfo,
                android.view.inputmethod.InputConnectionCompat.INPUT_CONTENT_GRANT_READ_URI_PERMISSION,
                null
            )
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    private fun copyToClipboard(file: File) {
        try {
            val uri = androidx.core.content.FileProvider.getUriForFile(
                this,
                "${packageName}.fileprovider",
                file
            )
            val clip = ClipData.newUri(
                contentResolver,
                "sticker",
                uri
            )
            clipboardManager.setPrimaryClip(clip)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun onEvaluateFullscreenMode(): Boolean = false

    override fun onPress(primaryCode: Int) {}
    override fun onRelease(primaryCode: Int) {}
    override fun onKey(primaryCode: Int, keyCodes: IntArray?) {}
    override fun onText(text: CharSequence?) {}
    override fun swipeLeft() {}
    override fun swipeRight() {}
    override fun swipeDown() {}
    override fun swipeUp() {}
}

private fun String.toUri(): Uri = Uri.parse(this)
