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

function freshCount(oldCount, isChecked) {
  let updatedCount = isChecked ? oldCount - 1 : oldCount + 1;
  return updatedCount < 5 ? updatedCount : 5;
}

function freshStatus(oldCount, isChecked) {
  let updatedStatus = isChecked ? false : true;
  return oldCount < 5 ? updatedStatus : false;
}

$(function initApp() {
  let counterButtonText = $('#button-text');
  let counterTextEl = $('.circle__selected');
  let counterButton = $('.circle__action');
  let selectedCount = 0;

  $('.circle__item').each(function initItem(index) {
    let circlePoint = $(this).find('.circle__point');
    let isChecked = false;
    $(this).click(function (event) {
      let count = selectedCount;
      event.preventDefault();
      selectedCount = freshCount(count, isChecked);
      isChecked = freshStatus(count, isChecked);
      circlePoint.attr('class', circlePointClass(isChecked));
      counterTextEl.html(counterText(selectedCount));
      counterButtonText.text(buttonText(selectedCount));
      counterButton.attr('class', buttonClass(selectedCount));
    });
  });

});
