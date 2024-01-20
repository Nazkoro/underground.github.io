"use strict"
//==========================================
const TELEGRAM_BOT_TOKEN = '6974955523:AAE1azHgrnSl8Pdb2qstwpPU2LIGc1Ra3KM';
const TELEGRAM_CHAT_ID = '-1001899112708';
const API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`


async function sendEmailTelegram(event) {
    event.preventDefault();

    const form = event.target;
    const formBtn = document.querySelector('.form__submit-button button')
    const formSendResult = document.querySelector('.form__send-result')
    formSendResult.textContent = '';


    const { fio, phone, year, height, weight, sport_type, city , ranks, insta ,awards , hasExpirience , telega } = Object.fromEntries(new FormData(form).entries());
    
    const text = `Заявка от ${fio}!\nТелефон: ${phone}\nДата рождения: ${year}\nРост: ${height} см\nВес: ${weight} кг\nВид спорта: ${sport_type}\nГород: ${city}\nРазряды: ${ranks}\nИнстаграм: ${insta}\nНаграды: ${awards}\nПроекты: ${hasExpirience}\nТелеграмм: ${telega}`;


    try {
        formBtn.textContent = 'Загрузка...';

        const response = await fetch(API, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text,
            })
        })
        
        if (response.ok) {
            formSendResult.textContent = 'Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.';
            form.reset()
        } else {
            throw new Error(response.statusText);
        }

    } catch (error) {
        console.error(error);
        formSendResult.textContent = 'Анкета не отправлена! Попробуйте позже.';
        formSendResult.style.color = 'red';

    } finally {
        formBtn.textContent = 'Отправить';
    }
}