const calculateAverageRating = (reviews) => {
    if (!reviews || Object.keys(reviews).length === 0) return 0;

    let sum = 0;
    let count = 0;

    for (const review of Object.values(reviews)) {
        if (typeof review === 'number') {
            sum += review;
            count++;
        } else if (typeof review === 'object' && review.rating) {
            sum += review.rating;
            count++;
        }
    }

    return sum / count;
};

export default calculateAverageRating;
