const patternSearchLinkLessonEgghead = /https:\/\/.*\/lessons\/.*\/(.*)\?.*/;


const executorRegExp = (pattern, string) => {
    return pattern.exec(string);
};

module.exports = {
    patternSearchLinkLessonEgghead,



    executorRegExp
};
