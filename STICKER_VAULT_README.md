# Sticker Vault - Android App

A powerful sticker collection app that lets you import stickers from anywhere (via Share Intent) and use them everywhere (via custom keyboard InputMethodService).

## Architecture Overview

### Part 1: The Collector (Share Import)
- **ShareReceiverActivity**: Receives images via Android's Share Intent
- **StickerStorage**: Handles file I/O, saves images as WebP format to internal storage
- **StickerDatabase**: Room database with Sticker and Folder entities
- No network calls needed - completely local

### Part 2: The Keyboard (InputMethodService)
- **StickerKeyboardIME**: Custom Input Method Service implementing the keyboard
- Shows a 4-column grid of saved stickers
- **Primary method**: Uses `InputConnection.commitContent()` to send images directly (works in Telegram, WhatsApp on Android 7+)
- **Fallback**: Copies sticker to clipboard for universal compatibility (works in SMS, any text field)
- **Usage tracking**: Increments usage count when a sticker is inserted

## Project Structure

```
app/
├── src/main/
│   ├── java/com/stickervault/
│   │   ├── db/
│   │   │   ├── Sticker.kt           # Room entity
│   │   │   ├── Folder.kt            # Room entity
│   │   │   ├── StickerDao.kt        # Database access
│   │   │   └── StickerDatabase.kt   # Room database
│   │   ├── receiver/
│   │   │   └── ShareReceiverActivity.kt  # Handles incoming images
│   │   ├── ime/
│   │   │   └── StickerKeyboardIME.kt     # InputMethodService
│   │   ├── storage/
│   │   │   └── StickerStorage.kt   # File management
│   │   └── ui/
│   │       ├── MainActivity.kt      # Main app UI (tabbed)
│   │       └── adapter/
│   │           └── StickerGridAdapter.kt  # Grid display
│   ├── res/
│   │   ├── values/
│   │   │   ├── strings.xml
│   │   │   ├── colors.xml
│   │   │   └── themes.xml
│   │   ├── xml/
│   │   │   ├── method.xml           # IME metadata
│   │   │   ├── file_paths.xml       # FileProvider paths
│   │   │   ├── backup_rules.xml
│   │   │   └── data_extraction_rules.xml
│   │   └── mipmap-*/
│   │       └── ic_launcher.png
│   └── AndroidManifest.xml
├── build.gradle
└── proguard-rules.pro

build.gradle                  # Project config
settings.gradle              # Gradle settings
gradle.properties            # Gradle properties
```

## Technology Stack

- **Language**: Kotlin
- **Database**: Android Room (SQLite)
- **Concurrency**: Kotlin Coroutines + Flow
- **Dependency Injection**: Hilt
- **Image Loading**: Coil
- **Min SDK**: Android 7.0+ (API 24)
- **Target SDK**: Android 14 (API 34)

## Setup & Build

### Prerequisites
- Android Studio (latest)
- Android SDK 34 (compiled against)
- Kotlin 1.9.0+

### Build Instructions

1. **Clone and navigate to project:**
   ```bash
   cd /path/to/fare-ke
   ```

2. **Build the app:**
   ```bash
   ./gradlew build
   ```

3. **Install on device/emulator:**
   ```bash
   ./gradlew installDebug
   ```

4. **Run tests:**
   ```bash
   ./gradlew test
   ```

## Features

### 1. Import Stickers (Collector)
- Long-press image in TikTok/any app → Share → "Add to Sticker Vault"
- Sticker is automatically saved and indexed
- Optional: Add tags when importing
- Support for single and multiple image imports

### 2. Use Stickers (Keyboard)
1. Go to **Settings > Keyboard & input methods**
2. Enable "Sticker Vault" as your input method
3. In any app, switch to Sticker Vault keyboard
4. Tap a sticker to:
   - **If app supports it**: Image is inserted directly via `commitContent()`
   - **Otherwise**: Image copied to clipboard (paste with Ctrl+V or long-press paste)

### 3. Organization
- **Folders**: Group stickers by category (Memes, Reactions, etc.)
- **Tags**: Add searchable tags to stickers
- **Recent**: View most-used stickers
- **Search**: Filter by tag (implemented in DB, can add UI)

### 4. Settings
- Enable/disable IME
- Clear all stickers
- View sticker storage info

## Database Schema

### Stickers Table
| Column | Type | Notes |
|--------|------|-------|
| id | Long (PK) | Auto-increment |
| filename | String | UUID.webp |
| folderId | Long (FK) | Optional folder |
| tags | String | Comma-separated |
| createdAt | Long | Timestamp |
| usage | Int | Count of uses |

### Folders Table
| Column | Type | Notes |
|--------|------|-------|
| id | Long (PK) | Auto-increment |
| name | String | Folder name |
| icon | String | Unicode emoji |
| createdAt | Long | Timestamp |

## API & Intents

### Share Intent (Input)
```xml
<action android:name="android.intent.action.SEND" />
<data android:mimeType="image/*" />
```

### InputMethodService (Output)
- **commitContent()**: Insert image directly (API 24+)
- **Clipboard fallback**: Copy image for manual paste

## Testing Strategy

### Manual Testing
1. **Import flow**: Share image from Files/Gallery → verify it appears in app
2. **Keyboard flow**: Enable IME → open WhatsApp → insert sticker → verify appears
3. **Clipboard fallback**: Disable commitContent support → insert sticker → paste → verify
4. **Data persistence**: Clear app, restart → verify stickers still exist

### Automated Tests (Unit)
- `StickerDaoTest`: CRUD operations
- `StickerStorageTest`: File I/O edge cases
- `ShareReceiverActivityTest`: Intent handling

## Known Limitations & TODOs

### V1 Limitations
- No cloud sync (intentional - all local)
- No sticker preview in keyboard (grid only)
- IME UI very basic (plain RecyclerView grid)
- No sticker search in keyboard
- No drag-to-organize

### Future Enhancements
- [ ] Search/filter in keyboard
- [ ] Sticker preview popups
- [ ] Swipe-to-delete gestures
- [ ] Sticker pack sharing (.zip)
- [ ] Cloud backup (optional)
- [ ] Custom folder icons
- [ ] Animated sticker support (.gif, .webm)

## Permissions Required

- `READ_EXTERNAL_STORAGE`: To import images
- `WRITE_EXTERNAL_STORAGE`: To save stickers (fallback)
- `ACCESS_MEDIA_LOCATION`: For high-res image access
- `BIND_INPUT_METHOD`: To register as keyboard (auto-granted)

## Security Notes

1. All stickers stored in **internal app directory** (not accessible to other apps without permission)
2. FileProvider used to safely share stickers via clipboard
3. No external API calls - fully offline
4. No user tracking or analytics

## Common Issues & Fixes

### IME Not Showing
- Go to Settings > Keyboard & input methods
- Enable "Sticker Vault"
- Make sure it's set as default or selected when needed

### Stickers Not Saving
- Check if app has storage permission
- Verify internal storage has space
- Check logcat for errors

### Clipboard Paste Not Working
- Some apps (old versions) don't support image clipboard paste
- Try commitContent-compatible apps (WhatsApp, Telegram)

## Building a Release

1. Create a signing key:
   ```bash
   keytool -genkey -v -keystore release.keystore -alias stickervault -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Update `build.gradle`:
   ```gradle
   signingConfigs {
       release {
           storeFile file('release.keystore')
           storePassword 'your-password'
           keyAlias 'stickervault'
           keyPassword 'your-password'
       }
   }
   ```

3. Build release APK:
   ```bash
   ./gradlew assembleRelease
   ```

## Contributing

When adding features:
1. Keep collector/keyboard separation clear
2. Minimize dependencies (Room, Coroutines, Coil only)
3. Test on API 24+ devices
4. Update this README with new features

## License

MIT License (implied)

---

**Built with care** - A minimal, focused app for sticker enthusiasts.
