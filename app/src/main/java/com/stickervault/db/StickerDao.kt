package com.stickervault.db

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

@Dao
interface StickerDao {
    @Query("SELECT * FROM stickers ORDER BY createdAt DESC")
    fun getAllStickers(): Flow<List<Sticker>>

    @Query("SELECT * FROM stickers WHERE folderId = :folderId ORDER BY createdAt DESC")
    fun getStickersByFolder(folderId: Long): Flow<List<Sticker>>

    @Query("SELECT * FROM stickers WHERE tags LIKE '%' || :tag || '%' ORDER BY createdAt DESC")
    fun getStickersByTag(tag: String): Flow<List<Sticker>>

    @Query("SELECT * FROM stickers ORDER BY usage DESC LIMIT :limit")
    fun getMostUsedStickers(limit: Int = 20): Flow<List<Sticker>>

    @Query("SELECT * FROM stickers WHERE id = :id")
    suspend fun getStickerById(id: Long): Sticker?

    @Insert
    suspend fun insertSticker(sticker: Sticker): Long

    @Update
    suspend fun updateSticker(sticker: Sticker)

    @Delete
    suspend fun deleteSticker(sticker: Sticker)

    @Query("DELETE FROM stickers WHERE id = :id")
    suspend fun deleteStickerById(id: Long)

    @Query("UPDATE stickers SET usage = usage + 1 WHERE id = :id")
    suspend fun incrementUsage(id: Long)
}

@Dao
interface FolderDao {
    @Query("SELECT * FROM folders ORDER BY name ASC")
    fun getAllFolders(): Flow<List<Folder>>

    @Query("SELECT * FROM folders WHERE id = :id")
    suspend fun getFolderById(id: Long): Folder?

    @Insert
    suspend fun insertFolder(folder: Folder): Long

    @Update
    suspend fun updateFolder(folder: Folder)

    @Delete
    suspend fun deleteFolder(folder: Folder)

    @Query("DELETE FROM folders WHERE id = :id")
    suspend fun deleteFolderById(id: Long)
}
