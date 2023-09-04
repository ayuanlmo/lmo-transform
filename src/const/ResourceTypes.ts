export const VIDEO_TYPE_MAP = [
    {name: 'MP4', type: 'video/mp4', label: 'MP4-H.264', libs: '-c:v libx264'},
    {name: 'MP4', type: 'video/mp4', label: 'MP4-H.265', libs: '-c:v libx265'},
    {name: 'M3U8', type: 'application/x-mpegurl', label: 'M3U8', libs: ''},
    {name: 'TS', type: 'video/vnd.dlna.mpeg-tts', label: 'TS-H264', libs: '-c:v libx264'},
    {name: 'TS', type: 'video/vnd.dlna.mpeg-tts', label: 'TS-H265', libs: '-c:v libx265'},
    {name: 'AVI', type: 'video/avi', label: 'AVI-H.264', libs: '-c:v libx264'},
    {name: 'MOV', type: 'video/quicktime', label: 'AVI-H.265', libs: '-c:v libx265'},
    {name: 'M4V', type: 'video/mp4', label: 'M4V', libs: ''},
    {name: 'MKV', type: 'video/x-matroska', label: 'MKV-H.264', libs: '-c:v libx264'},
    {name: 'MKV', type: 'video/x-matroska', label: 'MKV-H.265', libs: '-c:v libx265'}
]

export const AUDIO_TYPE_MAP = [
    {name: 'MP3', type: 'audio/mp3'},
    {name: 'FLAC', type: 'audio/flac'},
    {name: 'WAV', type: 'audio/wav'},
    {name: 'RA', type: 'audio/vnd.rn-realaudio'},
    {name: 'MP2', type: 'audio/mp2'}
]
