
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'ar-EG';

let playFav         = document.querySelector(".playFav")
let closeCurrentFav = document.querySelector(".closeCurrentFav")

let recordedChunks = [];

function separateCamelCase(input) {
  // استبدال حروف الكبيرة بمسافة والحفاظ على الحروف الصغيرة
  return input.replace(/([a-zA-Z])([؀-ۿ])/g, '$1 $2');
}

recognition.onresult = async function (event) {
  const speechResult = event.results[0][0].transcript;
  console.log(speechResult);
  recordedChunks.push(speechResult);
  const words = speechResult.split(" ");


if (words[0] == "شغل" && words.length > 1) {

  const surahName = words.slice(1).join(' ');
  await speak("جاري تنفيذ طلبك");
  searchAndPlaySurahOnYouTube(surahName);

} 
if (words[0] == "وقف" || words[0] == "اسكت") {
  stopYouTubePlayer();
} 




}


closeCurrentFav.addEventListener("click",()=>{
  recognition.stop();
  recognition.onend = function() {
    recognition.stop();
  };
  stopYouTubePlayer()
})

playFav.addEventListener("click",()=>{
  recognition.start();
})



let player;

function searchAndPlaySurahOnYouTube(surahName) {
  const apiKey = 'AIzaSyB6-iYMYCniXT5xCoKOV6JH2KLLTRCWado';
  const apiUrl = `https://www.googleapis.com/youtube/v3/search?q=${surahName}&part=snippet&type=video&key=${apiKey}`;

  // قبل تشغيل الفيديو الجديد، تأكد من إيقاف أي فيديو قيد التشغيل

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          const videoId = data.items[0].id.videoId;

          // قم بتشغيل الفيديو الجديد
          player = new YT.Player('youtube-player', {
            height: '0',
            width: '0',
            videoId: videoId,
            playerVars: {
              'autoplay': 1,
              'controls': 0,
              'showinfo': 0,
              'modestbranding': 1,
              'loop': 1,
              'fs': 0,
              'cc_load_policy': 0,
              'iv_load_policy': 3,
            },
            events: {
              'onReady': onPlayerReady,
            },
          });
        } else {
          console.error('لم يتم العثور على فيديوهات.');
        }
      })
      .catch(error => {
        console.error('حدث خطأ أثناء البحث عن السورة على YouTube:', error);
      });
  
}

function onPlayerReady(event) {
  console.log('تم تشغيل الفيديو');
  event.target.playVideo();
  // يمكنك إضافة رسالة إلى المستخدم هنا
}

function stopYouTubePlayer() {

  // إذا كان هناك فيديو قيد التشغيل وليس محذوفًا، قم بإيقافه
  if (player && player.stopVideo) {
    console.log('تم إيقاف الفيديو');
    player.stopVideo();
    if (player.destroy) {
      console.log('تم قطع الاتصال مع المشغل السابق');
      player.destroy(); // قطع الاتصال مع المشغل السابق
    }
    // يمكنك إضافة رسالة إلى المستخدم هنا
  }

}


async function speak(text) {
  console.log(text);
  try {
    await responsiveVoice.speak(text, 'Arabic Male');
  } catch (error) {
    console.error('حدث خطأ أثناء تشغيل الصوت:', error);
  }
}