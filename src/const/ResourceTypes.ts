export const VIDEO_TYPE_MAP = [
    {name: 'MP4', type: 'video/mp4', label: 'MP4-H.264', libs: '-c:v libx264'},
    {name: 'MP4', type: 'video/mp4', label: 'MP4-H.265', libs: '-c:v libx265'},
    {name: 'M3U8', type: 'application/x-mpegurl', label: 'M3U8', libs: ''},
    {name: 'TS', type: 'text/plain', label: 'TS-H264', libs: '-c:v libx264'},
    {name: 'TS', type: 'text/plain', label: 'TS-H265', libs: '-c:v libx265'},
    {name: 'AVI', type: 'video/avi', label: 'AVI-H.264', libs: '-c:v libx264'},
    {name: 'MOV', type: 'video/quicktime', label: 'AVI-H.265', libs: '-c:v libx265'},
    {name: 'M4V', type: 'video/mp4', label: 'M4V', libs: ''},
    {name: 'MKV', type: 'video/x-matroska', label: 'MKV-H.264', libs: '-c:v libx264'},
    {name: 'MKV', type: 'video/x-matroska', label: 'MKV-H.265', libs: '-c:v libx265'}
]

export const AUDIO_TYPE_MAP = [
    {name: 'MP3', type: 'audio/mpeg', label: 'MP3'},
    {name: 'FLAC', type: 'audio/flac', label: 'FLAC'},
    {name: 'WAV', type: 'audio/wav', label: 'WAV'},
    {name: 'RA', type: 'audio/vnd.rn-realaudio', label: 'RA'},
    {name: 'MP2', type: 'audio/mp2', label: 'MP2'}
]
