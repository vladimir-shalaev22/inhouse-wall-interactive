function counterText(count) {
  return `${count} из 5 пунктов<br> выбрано`;
}

function buttonText(count) {
  return count < 5 ? `Выберите ещё ${5-count}` : `Узнать результат`;
}

function buttonClass(count) {
  return count < 5 ?
    'circle__action circle__action--locked' : 'circle__action';
}

function circlePointClass(isChecked) {
  return isChecked ?
    'circle__point circle__point--active' : 'circle__point';
}

function displayItem(isChecked) {
  return isChecked ? 'inline-block' : 'none';
}

function displayRow(isChecked) {
  return isChecked ? 'table-row' : 'none';
}

function freshCount(oldCount, isChecked) {
  let updatedCount = isChecked ? oldCount - 1 : oldCount + 1;
  return updatedCount < 5 ? updatedCount : 5;
}

function freshStatus(oldCount, isChecked) {
  let updatedStatus = isChecked ? false : true;
  return oldCount < 5 ? updatedStatus : false;
}

$(function initApp() {
  let listItems = $('.items-list__item').hide();
  let tableRows = $('.data__item').hide();
  let counterButtonText = $('#button-text');
  let counterButton = $('.circle__action');
  let resultBlocks = $('.screen--result, .footer').hide();
  let interactiveBlock = $('.screen--interactive');
  let selectedCount = 0;

  let targetIndex = [
    [5, 0], [6, 9], [0, 1], [2, 8], [7, 2], [3, 7], [8, 3], [1, 6], [4, 4], [9, 5]
  ];

  $('.circle__item').each(function initItem(index) {
    let circlePoint = $(this).find('.circle__point');
    let isChecked = false;

    $(window).on('clear-items', function clear() {
      isChecked = false;
    });

    $(this).click(function (event) {
      let count = selectedCount;
      event.preventDefault();
      selectedCount = freshCount(count, isChecked);
      isChecked = freshStatus(count, isChecked);
      circlePoint.attr('class', circlePointClass(isChecked));
      counterButtonText.text(buttonText(selectedCount));
      counterButton.attr('class', buttonClass(selectedCount));
      listItems.eq(targetIndex[index][0]).css('display', displayItem(isChecked));
      tableRows.eq(targetIndex[index][1]).css('display', displayRow(isChecked));
      if (selectedCount === 5 && $(window).width() < 768) {
        $(window).scrollTop(150);
      }
    });
  });

  counterButton.click(function triggerResult(event) {
    event.preventDefault();
    if (selectedCount === 5) {
      history.pushState({state:'result'}, 'Результаты', 'result.html');
      $('.loading-popup').addClass('loading-popup--active');
      setTimeout(function showResult() {
        interactiveBlock.hide();
        resultBlocks.show();
        $('.loading-popup').removeClass('loading-popup--active');
        $(window).scrollTop(0);
      }, 800);
    }
  });

  $('form').each(function initForm() {
    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    let form = $(this);
    let url = form.attr('action');
    let email = form.find('input[name=email]');

    form.submit(function submitForm() {
      if (!reg.test(email.val())) {
        form.addClass('form--error');
        form.find('.form__label').text('Введите Ваш e-mail!');
        return false;
      }
    });

    email.focus(function removeError() {
      form.removeClass('form--error');
      form.find('.form__label').text('Ваш e-mail');
    });
  });

  $(window).on('popstate', function updatePage(event) {
    $('.loading-popup').addClass('loading-popup--active');
    setTimeout(function showResult() {
      interactiveBlock.show();
      resultBlocks.hide();
      listItems.hide();
      tableRows.hide();
      selectedCount = 0;
      counterButtonText.text(buttonText(selectedCount));
      counterButton.attr('class', buttonClass(selectedCount));
      $(window).trigger('clear-items');
      $('.circle__point').removeClass('circle__point--active');
      $('.loading-popup').removeClass('loading-popup--active');
      $(window).scrollTop(0);
    }, 500);
  });

  function openPopup(target) {
    let overlay = $('.popup-overlay');
    let container = $('.popup-container');
    let popup = $(target);

    function closePopup() {
      overlay.removeClass('popup-overlay--visible');
      container.removeClass('popup-container--visible');
      popup.removeClass('popup--open');
    }

    container.click(closePopup);

    popup.click(function (event) {
      return false;
    });

    popup.find('.popup__close').click(function (event) {
      event.preventDefault();
      closePopup();
    });

    $(window).keydown(function (event) {
      if (event.originalEvent.keyCode === 27) {
        closePopup();
      }
    });

    overlay.addClass('popup-overlay--visible');
    container.addClass('popup-container--visible');
    popup.addClass('popup--open');
  }

  $('.js-popup').click(function (event) {
    let target = $(this).attr('href');
    event.preventDefault();
    openPopup(target);
  });

  $('.js-scroll').smoothScroll();

});
