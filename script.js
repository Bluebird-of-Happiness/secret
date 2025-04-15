// RSS-лента (через прокси для обхода блокировок)
const rssUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://fairyteller.org/rss');
// Здесь мы создаём переменную с адресом RSS-ленты, оборачивая её в сервис AllOrigins,
// который позволяет обойти ограничения CORS (кросс-доменных запросов).

// Текущая страница (для эмуляции бесконечной прокрутки)
let page = 1;
// Устанавливаем начальный номер страницы — в нашем случае это символическая переменная,
// так как настоящих страниц в RSS-ленте нет. Она используется для имитации "страничной" загрузки.

// Флаг, который не даёт загружать новости слишком часто
let loading = false;
// Булевская переменная, предотвращающая повторную загрузку, пока текущая не завершилась.

// Функция загрузки и парсинга RSS-ленты
async function fetchRSS(url) {
  const response = await fetch(url);
  // Отправляем HTTP-запрос на указанный URL и получаем ответ.

  const data = await response.json();
  // Преобразуем полученный ответ в формат JSON. AllOrigins оборачивает содержимое в JSON-объект.

  const rssText = data.contents;
  // Извлекаем чистое содержимое RSS-ленты из поля `contents` (это строка XML).

  const parser = new DOMParser();
  // Создаём объект DOMParser, который позволяет преобразовывать XML-строки в DOM-объекты.

  const rssXML = parser.parseFromString(rssText, "application/xml");
  // Преобразуем XML-строку в DOM-структуру для дальнейшей работы с ней.

  return rssXML;
  // Возвращаем полученную структуру XML.
}

// Функция отображения новостей на странице
function displayNews(rss) {
  const items = rss.querySelectorAll('item');
  // Извлекаем все элементы <item>, содержащие отдельные новости.

  const container = document.getElementById('news-container');
  // Получаем DOM-элемент, в который будем добавлять новости.

  items.forEach(item => {
    const newsDiv = document.createElement('div');
    newsDiv.className = 'news-item';
    // Создаём новый <div> для каждой новости и назначаем ему CSS-класс.

    const title = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    const description = item.querySelector('description').textContent;
    const pubDate = item.querySelector('pubDate').textContent;
    // Извлекаем заголовок, ссылку, описание и дату публикации из каждого элемента новости.

    newsDiv.innerHTML = `
      <h2><a href="${link}" target="_blank">${title}</a></h2>
      <p>${description}</p>
      <div class="pubDate">${pubDate}</div>
    `;
    // Формируем HTML-разметку для одной новости: заголовок-ссылка, текст и дата.

    // Корректируем изображения
    newsDiv.querySelectorAll('img').forEach(img => {
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
    });
    // Если в описании содержатся изображения, адаптируем их размеры под контейнер страницы.

    container.appendChild(newsDiv);
    // Добавляем сформированный блок новости в контейнер.
  });

  loading = false;
  // Снимаем флаг загрузки, позволяя в будущем загружать следующую порцию.
}

// Функция бесконечной прокрутки
async function infiniteScroll() {
  if (loading) return;
  // Если в данный момент уже идёт загрузка — выходим из функции, не делая ничего.

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
    // Проверяем, находится ли пользователь почти у конца страницы
    // (с запасом в 300 пикселей до низа).

    loading = true;
    // Устанавливаем флаг, что началась новая загрузка.

    page += 1;
    // Увеличиваем счётчик страницы (в нашем случае символический шаг вперёд).

    const rss = await fetchRSS(rssUrl);
    // Загружаем RSS-ленту заново (имитируя новую порцию данных).

    displayNews(rss);
    // Отображаем загруженные новости на странице.
  }
}

// Инициализация первой загрузки
fetchRSS(rssUrl).then(displayNews).catch(console.error);
// При первом открытии страницы — загружаем RSS и отображаем новости.
// Если возникает ошибка — выводим её в консоль.

// Слушатель прокрутки страницы для бесконечной прокрутки
window.addEventListener('scroll', infiniteScroll);
// Назначаем обработчик события прокрутки страницы.
// При прокрутке вызывается функция, проверяющая, пора ли загружать новые новости.