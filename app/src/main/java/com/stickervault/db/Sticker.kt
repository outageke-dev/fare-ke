package com.stickervault.db

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey
import java.io.File

@Entity(
    tableName = "stickers",
    indices = [Index("folderId"), Index("createdAt")],
    foreignKeys = [
        ForeignKey(
            entity = Folder::class,
            parentColumns = ["id"],
            childColumns = ["folderId"],
            onDelete = ForeignKey.CASCADE
        )
    ]
)
data class Sticker(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val filename: String,
    val folderId: Long? = null,
    val tags: String = "", // comma-separated tags
    val createdAt: Long = System.currentTimeMillis(),
    val usage: Int = 0 // track how often this sticker is used
)

@Entity(tableName = "folders")
data class Folder(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val name: String,
    val icon: String = "📁",
    val createdAt: Long = System.currentTimeMillis()
)
