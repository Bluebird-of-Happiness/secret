// Ждём полной загрузки страницы перед выполнением скрипта
document.addEventListener('DOMContentLoaded', function() {
    // Убедимся, что весь HTML загружен, прежде чем мы начнём создавать элементы
    
    // Функция создания и показа всплывающего окна
    function showModal() {
      // Создаём фон (затемнение)
      const overlay = document.createElement('div');  // Создаём элемент <div>, который будет затемнением
      overlay.className = 'modal-overlay';            // Назначаем ему CSS-класс для стилизации (см. CSS)
  
      // Создаём само окно с контентом
      const modal = document.createElement('div');    // Создаём ещё один <div> — это уже само окно
      modal.className = 'modal';                      // Назначаем ему соответствующий класс
  
      modal.innerHTML = `
        <h2>Внимание!</h2>
        <p>Это демонстрационный сайт, все создано в ознакомительных целях. Продолжить?</p>
        <div class="modal-buttons">
          <button class="button-yes">ДА</button>
          <button class="button-no">НЕТ</button>
        </div>
      `;
      // Заполняем окно HTML-разметкой: заголовок, текст и две кнопки ("ДА" и "НЕТ")
  
      // Добавляем окно на фон
      overlay.appendChild(modal);                     // Вставляем модальное окно внутрь затемнённого фона
  
      // Добавляем фон на страницу
      document.body.appendChild(overlay);             // Вставляем затемнённый фон (с окном внутри) в тело страницы
  
      // Обработка нажатия кнопки "ДА"
      modal.querySelector('.button-yes').addEventListener('click', function() {
        overlay.remove();                             // При нажатии на "ДА" — удаляем модальное окно и фон
      });
  
      // Обработка нажатия кнопки "НЕТ"
      modal.querySelector('.button-no').addEventListener('click', function() {
        overlay.remove();                             // Сначала удаляем окно, чтобы очистить интерфейс
        document.body.innerHTML = '<h1 style="text-align:center; margin-top:50px;">Вы отказались от просмотра страницы.</h1>';
        // Затем заменяем всё содержимое страницы сообщением о том, что пользователь отказался от просмотра
      });
    }
  
    // Показываем окно сразу после загрузки страницы
    showModal();                                       // Вызываем функцию показа модального окна сразу после загрузки
  });