// REVIEW 

//Review slider

const $content = $body.querySelector('.content');
const $reviewContentContainer = $body.querySelector('.reviews__content-container');
let $reviewsArray = $reviewContentContainer.querySelectorAll('.review');

setTimeout(() => {
    const countReview = $reviewsArray.length;
    let contentWidth = $content.clientWidth - 30;
    let reviewWidth = $reviewsArray[0].clientWidth;
    let countReviewInContainer = ((contentWidth % reviewWidth) / (Math.floor(contentWidth / reviewWidth) - 1) >= 10) ? Math.floor(contentWidth / reviewWidth) : Math.floor(contentWidth / reviewWidth) - 1;
    let reviewGap = ((contentWidth - (reviewWidth * countReviewInContainer)) / (countReviewInContainer - 1) < 25) ? (contentWidth - (reviewWidth * countReviewInContainer)) / (countReviewInContainer - 1) : 25;
    let sidePadding = (contentWidth - (countReviewInContainer * reviewWidth + reviewGap * (countReviewInContainer - 1))) / 2;

    $reviewContentContainer.style.width = `${(contentWidth - sidePadding * 2 > contentWidth) ? contentWidth : contentWidth - sidePadding * 2}px`;

    let maxReviewHight = 0
    $reviewsArray.forEach($review => {
        if ($review.clientHeight > maxReviewHight) {
            maxReviewHight = $review.clientHeight;
        }
    });
    $reviewsArray.forEach($review => {
        $review.style.height = `${maxReviewHight}px`;
    });

    $reviewContentContainer.style.height = `${maxReviewHight}px`;
    $reviewsArray[0].style.left = `-${reviewWidth + reviewGap}px`
    $reviewsArray[1].style.left = `${0}px`
    for (let i = 0; i < countReviewInContainer - 1; i++) {
        $reviewsArray[i + 2].style.left = `${(reviewWidth + reviewGap) * (i + 1)}px`
    }
    for (let i = 0; i < countReview - countReviewInContainer - 1; i++) {
        $reviewsArray[countReviewInContainer + i + 1].style.left = `${(reviewWidth + reviewGap) * countReviewInContainer}px`
    }

    window.addEventListener('resize', () => {
        setTimeout(() => {
            contentWidth = $content.clientWidth - 30;
            reviewWidth = $reviewsArray[0].clientWidth;
            countReviewInContainer = ((contentWidth % reviewWidth) / (Math.floor(contentWidth / reviewWidth) - 1) >= 10) ? Math.floor(contentWidth / reviewWidth) : Math.floor(contentWidth / reviewWidth) - 1;
            reviewGap = ((contentWidth - (reviewWidth * countReviewInContainer)) / (countReviewInContainer - 1) < 25) ? (contentWidth - (reviewWidth * countReviewInContainer)) / (countReviewInContainer - 1) : 25;
            sidePadding = (contentWidth - (countReviewInContainer * reviewWidth + reviewGap * (countReviewInContainer - 1))) / 2;

            $reviewContentContainer.style.width = `${(contentWidth - sidePadding * 2 > contentWidth) ? contentWidth : contentWidth - sidePadding * 2}px`;
            $reviewContentContainer.style.height = `${$reviewsArray[0].clientHeight}px`;
            $reviewsArray[0].style.left = `-${reviewWidth + reviewGap}px`
            $reviewsArray[1].style.left = `${0}px`
            for (let i = 0; i < countReviewInContainer - 1; i++) {
                $reviewsArray[i + 2].style.left = `${(reviewWidth + reviewGap) * (i + 1)}px`
            } 
            for (let i = 0; i < countReview - countReviewInContainer - 1; i++) {
                $reviewsArray[countReviewInContainer + i + 1].style.left = `${(reviewWidth + reviewGap) * countReviewInContainer}px`
            }
        }, 500);
    })

    setInterval(slide, 5000);

    function slide() {
        for (let i = 0; i < countReviewInContainer + 1; i++) {
            $reviewsArray[i + 1].style.left = `${parseInt($reviewsArray[i + 1].style.left) - (reviewWidth + reviewGap)}px`;
        }
        
        $reviewsArray[0].style.left = `${(reviewWidth + reviewGap) * countReviewInContainer}px`
        $reviewContentContainer.append($reviewsArray[0]);
        $reviewsArray = $reviewContentContainer.querySelectorAll('.review');
    }
}, '1000');