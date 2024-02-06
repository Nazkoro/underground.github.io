const TELEGRAM_BOT_TOKEN = '6974955523:AAE1azHgrnSl8Pdb2qstwpPU2LIGc1Ra3KM';
const TELEGRAM_CHAT_ID = '-1001899112708';
const textAPI = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
const photoAPI = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`

async function sendEmailTelegram(event) {
    let attempt = Number(localStorage.getItem('attempt')) || 0
     event.preventDefault();
     if(attempt >= 1){
        alert('Внимание! Вы отправили уже 2 заявки. Для защиты от спама форма будет заблокирована на 1 час')
        document.getElementById("send-btn").disabled = true; 
        setTimeout(() => {
             localStorage.setItem('attempt',0)
            document.getElementById("send-btn").disabled = false;
        }, 1000 * 60 *60);
        return
     }
    const form = event.target;
    const formBtn = document.querySelector('.form__submit-button button')
    const formSendResult = document.querySelector('.form__send-result')
    formSendResult.textContent = '';

    const { fio, phone, year, height, weight, sport_type, city , ranks, insta ,awards , hasExpirience , telega } = Object.fromEntries(new FormData(form).entries());
    const text = `Заявка от: ${fio}!\nТелефон: ${phone}\nВозраст: ${year}\nРост: ${height} см\nВес: ${weight} кг\nВид спорта: ${sport_type}\nГород: ${city}\nРазряды: ${ranks}\nИнстаграм: ${insta}\nНаграды: ${awards}\nПроекты: ${hasExpirience}\nТелеграмм: ${telega}`;

    const fileInput = document.getElementById('filefield');
    const photoFile = fileInput?.files[0];
  
    if (!photoFile) {
      alert('Загрузите фото!');
      return;
    }
    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('photo', photoFile);

    try {
        formBtn.textContent = 'Загрузка...';
        const [response1,response2] = await Promise.all([
            fetch(textAPI, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text,
                })
            }),
                fetch(photoAPI, {
                    method: "POST",
                    body: formData,
                })
        ]) 
        
        if (response1.ok && response2.ok) {
            attempt+=1
            localStorage.setItem('attempt',attempt)
            alert('Ваша заявка отправлена, мы с вами свяжемся!')
            formSendResult.textContent = 'Ваша заявка отправлена, мы с вами свяжемся!';
            form.reset()
        } else {
            alert('Ошибка выполнения запроса')
            throw new Error('Ошибка выполнения запроса');
        }

    } catch (error) {
        console.error(error);
        formSendResult.textContent = 'Анкета не отправлена! Попробуйте позже.';
        formSendResult.style.color = 'red';

    } finally {
        formBtn.textContent = 'Отправить';
    }
}