import React, { useEffect, useState } from 'react';
import {
View,
Text,
StyleSheet,
TouchableOpacity,
SafeAreaView,
Alert,
ScrollView,
} from 'react-native';
const App = () => {
const [isActive, setIsActive] = useState(false);
const [timer, setTimer] = useState('00:00');
const [notificationCount, setNotificationCount] = useState(0);
const [intervalId, setIntervalId] = useState(null);
useEffect(() => {
return () => {
if (intervalId) clearInterval(intervalId);
};
}, [intervalId]);
const updateTimer = () => {
const now = new Date();
const nextMinute = new Date(now.getTime() + 60 * 1000);
nextMinute.setSeconds(0);
nextMinute.setMilliseconds(0);
const diff = nextMinute - now;
const mins = Math.floor((diff / (1000 * 60)) % 60);
const secs = Math.floor((diff / 1000) % 60);
setTimer(
`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
);
};
const sendNotification = () => {
const now = new Date();
const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
now.getMinutes()
).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
if ('Notification' in window && Notification.permission === 'granted') {
new Notification('📱 Yeni Mesaj', {
body: 'naber canım! 🔥',
icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50" font-size="80" text-anchor="middle">📱</text></svg>',
tag: 'bildirim',
requireInteraction: false,
});
try {
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();
oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);
oscillator.frequency.value = 800;
gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
oscillator.start(audioContext.currentTime);
oscillator.stop(audioContext.currentTime + 0.5);
} catch (e) {
console.log('Ses çalınamadı');
}
}
alert(`🔔 Bildirim Gönderildi!\n\nnaber canım! 🔥\n\nSaat: ${timeStr}`);
setNotificationCount((prev) => prev + 1);
};
const startNotifications = async () => {
if ('Notification' in window && Notification.permission === 'default') {
const permission = await Notification.requestPermission();
if (permission !== 'granted') {
alert('❌ Bildirim iznini ver');
return;
}
}
setIsActive(true);
setNotificationCount(0);
const now = new Date();
const nextMinute = new Date(now.getTime() + 60 * 1000);
nextMinute.setSeconds(0);
nextMinute.setMilliseconds(0);
const timeUntilNext = nextMinute - now;
updateTimer();
const timerInterval = setInterval(updateTimer, 1000);
setIntervalId(timerInterval);
const initialTimeout = setTimeout(() => {
sendNotification();
const notificationInterval = setInterval(() => {
sendNotification();
}, 60 * 1000);
setIntervalId(notificationInterval);
}, timeUntilNext);
alert(
`✅ Başarılı!\n\n⏰ ${Math.ceil(timeUntilNext / 1000)} saniye sonra`
);
return () => clearTimeout(initialTimeout);
};
const stopNotifications = () => {
if (intervalId) {
clearInterval(intervalId);
setIntervalId(null);
}
setIsActive(false);
alert('🛑 Durduruldu');
};
const testNow = () => {
sendNotification();
};
return (
<SafeAreaView style={styles.container}>
<ScrollView contentContainerStyle={styles.content}>
<View style={styles.header}>
<Text style={styles.emoji}>📱</Text>
<Text style={styles.title}>Dakikalık Bildirim</Text>
<Text style={styles.subtitle}>Her dakika "naber canım" al</Text>
</View>
<View
style={[styles.statusBox, isActive ? styles.statusOn : styles.statusOff]}
>
<Text style={styles.statusEmoji}>{isActive ? '🔔' : '🔕'}</Text>
<Text style={styles.statusTitle}>
{isActive ? 'AKTIF ✅' : 'KAPAL ❌'}
</Text>
{isActive && (
<Text style={styles.statusCount}>
{notificationCount} bildirim
</Text>
)}
</View>
{isActive && (
<View style={styles.timerBox}>
<Text style={styles.timerLabel}>⏱️ Sonraki:</Text>
<Text style={styles.timerText}>{timer}</Text>
</View>
)}
<View style={styles.buttons}>
{!isActive ? (
<TouchableOpacity
style={[styles.button, styles.buttonGreen]}
onPress={startNotifications}
>
<Text style={styles.buttonText}>✅ BAŞLA</Text>
</TouchableOpacity>
) : (
<TouchableOpacity
style={[styles.button, styles.buttonRed]}
onPress={stopNotifications}
>
<Text style={styles.buttonText}>🛑 DURDUR</Text>
</TouchableOpacity>
)}
<TouchableOpacity
style={[styles.button, styles.buttonOrange]}
onPress={testNow}
>
<Text style={styles.buttonText}>🧪 TEST</Text>
</TouchableOpacity>
</View>
</ScrollView>
</SafeAreaView>
);
};
const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#f5f7fa',
},
content: {
padding: 20,
paddingBottom: 40,
},
header: {
alignItems: 'center',
marginBottom: 25,
marginTop: 20,
},
emoji: {
fontSize: 60,
marginBottom: 10,
},
title: {
fontSize: 26,
fontWeight: 'bold',
color: '#001f3f',
marginBottom: 8,
},
subtitle: {
fontSize: 14,
color: '#666',
textAlign: 'center',
},
statusBox: {
borderRadius: 15,
padding: 25,
alignItems: 'center',
marginBottom: 20,
elevation: 4,
},
statusOn: {
backgroundColor: '#c8e6c9',
},
statusOff: {
backgroundColor: '#ffcdd2',
},
statusEmoji: {
fontSize: 48,
marginBottom: 10,
},
statusTitle: {
fontSize: 18,
fontWeight: 'bold',
color: '#001f3f',
marginBottom: 5,
},
statusCount: {
fontSize: 12,
color: '#0052A3',
fontWeight: '600',
},
timerBox: {
backgroundColor: '#fff9c4',
borderRadius: 15,
padding: 20,
alignItems: 'center',
marginBottom: 20,
borderWidth: 2,
borderColor: '#fbc02d',
},
timerLabel: {
fontSize: 14,
color: '#f57f17',
fontWeight: '600',
marginBottom: 10,
},
timerText: {
fontSize: 56,
fontWeight: 'bold',
color: '#fbc02d',
fontFamily: 'monospace',
},
buttons: {
gap: 12,
marginBottom: 25,
},
button: {
paddingVertical: 16,
paddingHorizontal: 20,
borderRadius: 12,
alignItems: 'center',
elevation: 5,
shadowColor: '#000',
shadowOpacity: 0.2,
shadowRadius: 4,
},
buttonGreen: {
backgroundColor: '#4caf50',
},
buttonRed: {
backgroundColor: '#f44336',
},
buttonOrange: {
backgroundColor: '#ff9800',
},
buttonText: {
color: 'white',
fontSize: 16,
fontWeight: 'bold',
},
});
export default App;
