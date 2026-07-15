package com.stickervault.db

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(
    entities = [Sticker::class, Folder::class],
    version = 1,
    exportSchema = false
)
abstract class StickerDatabase : RoomDatabase() {
    abstract fun stickerDao(): StickerDao
    abstract fun folderDao(): FolderDao

    companion object {
        @Volatile
        private var INSTANCE: StickerDatabase? = null

        fun getDatabase(context: Context): StickerDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    StickerDatabase::class.java,
                    "sticker_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
