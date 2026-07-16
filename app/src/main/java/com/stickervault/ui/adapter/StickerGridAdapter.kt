package com.stickervault.ui.adapter

import android.content.Context
import android.graphics.BitmapFactory
import android.view.View
import android.view.ViewGroup
import android.widget.AbsListView
import android.widget.BaseAdapter
import android.widget.ImageView
import com.stickervault.db.Sticker
import com.stickervault.storage.StickerStorage

class StickerGridAdapter(
    private val context: Context,
    private val stickers: List<Sticker>,
    private val storage: StickerStorage,
    private val onStickerClick: (Sticker) -> Unit
) : BaseAdapter() {

    override fun getCount(): Int = stickers.size

    override fun getItem(position: Int): Sticker = stickers[position]

    override fun getItemId(position: Int): Long = stickers[position].id

    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        val imageView = if (convertView is ImageView) {
            convertView
        } else {
            ImageView(context).apply {
                layoutParams = AbsListView.LayoutParams(120, 120)
                scaleType = ImageView.ScaleType.CENTER_CROP
            }
        }

        val sticker = getItem(position)
        val file = storage.getStickerFile(sticker.filename)

        if (file.exists()) {
            val bitmap = BitmapFactory.decodeFile(file.absolutePath)
            imageView.setImageBitmap(bitmap)
        }

        imageView.setOnClickListener {
            onStickerClick(sticker)
        }

        return imageView
    }
}
