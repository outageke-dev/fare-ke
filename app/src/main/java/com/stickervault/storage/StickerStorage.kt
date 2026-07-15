package com.stickervault.storage

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import java.io.File
import java.io.FileOutputStream
import java.util.UUID

class StickerStorage(private val context: Context) {
    private val stickersDir: File
        get() {
            val dir = File(context.filesDir, "stickers")
            if (!dir.exists()) {
                dir.mkdirs()
            }
            return dir
        }

    suspend fun saveImageFromUri(uri: Uri): String {
        val filename = "${UUID.randomUUID()}.webp"
        val file = File(stickersDir, filename)

        try {
            val bitmap = loadBitmap(uri)
            saveBitmap(bitmap, file)
            return filename
        } catch (e: Exception) {
            throw StickerStorageException("Failed to save image: ${e.message}", e)
        }
    }

    private fun loadBitmap(uri: Uri): Bitmap {
        val inputStream = context.contentResolver.openInputStream(uri)
            ?: throw IllegalArgumentException("Cannot open URI: $uri")

        return inputStream.use { stream ->
            BitmapFactory.decodeStream(stream)
                ?: throw IllegalArgumentException("Cannot decode bitmap from URI: $uri")
        }
    }

    private fun saveBitmap(bitmap: Bitmap, file: File) {
        FileOutputStream(file).use { out ->
            bitmap.compress(Bitmap.CompressFormat.WEBP_LOSSLESS, 100, out)
        }
    }

    fun getStickerFile(filename: String): File {
        return File(stickersDir, filename)
    }

    fun deleteStickerFile(filename: String) {
        File(stickersDir, filename).delete()
    }

    fun getAllStickerFiles(): List<File> {
        return stickersDir.listFiles()?.toList() ?: emptyList()
    }
}

class StickerStorageException(message: String, cause: Throwable? = null) :
    Exception(message, cause)
