function shuffle(array) {
    var i = array.length,
        j = 0,
        temp;
 
    while (i--) {
 
        j = Math.floor(Math.random() * (i+1));
 
        // swap randomly chosen element with current element
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
 
    }
 
    return array;
}

const QuizData  = ( flashcards ) => {
    var quizData = [];
    
    var correct_option = [];
    var option_1 = [];
    var option_2 = [];
    var option_3 = [];

    for(let i = 0; i < flashcards.length; i++) {
        correct_option.push(i);
    }

    var i = correct_option.length,
        j = 0,
        temp;
 
    while (i-- >= correct_option.length/2) {
        j = Math.floor(Math.random() * (i+1));
 
        // swap randomly chosen element with current element
        temp = correct_option[i];
        correct_option[i] = correct_option[j];
        correct_option[j] = temp;

        i--;
        j = Math.floor(Math.random() * (i+1));
        temp = correct_option[i];
        correct_option[i] = correct_option[j];
        correct_option[j] = temp;
        option_1.push(correct_option[i]);

        i--;
        j = Math.floor(Math.random() * (i+1));
        temp = correct_option[i];
        correct_option[i] = correct_option[j];
        correct_option[j] = temp;
        option_2.push(correct_option[i]);

        i--;
        j = Math.floor(Math.random() * (i+1));
        temp = correct_option[i];
        correct_option[i] = correct_option[j];
        correct_option[j] = temp;
        option_3.push(correct_option[i]);

        i += 3;
    }

    for(let i = 0; i <= flashcards.length/2; i++) {
        var correct = correct_option[flashcards.length - 1 - i];
        // console.log(correct);
        var options = shuffle([correct, option_1[i], option_2[i], option_3[i]]);
        quizData.push({
            "question" : "What sign is this?",
            "video": flashcards[correct].video.toString(),
            "options" : [flashcards[options[0]].gloss.toString(), flashcards[options[1]].gloss.toString(), flashcards[options[2]].gloss.toString(), flashcards[options[3]].gloss.toString()],
            "correct_option" : flashcards[correct].gloss.toString()
        });
    }

    return quizData;
}

export default QuizData