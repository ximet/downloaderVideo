const patternSearchLinkLessonEgghead = /https:\/\/.*\/lessons\/.*\/(.*)\?.*/;
const patternSearchUrlToLessonEgghead = /egghead.io\/lessons\/(.*)\?/;
const patternCountLessonInCourseEgghead = /<h4 class="title"><a href="(https:\/\/egghead.io\/lessons\/.+?)">/g;
const patternTitleLessonInCourseEgghead = /<meta itemprop="name" content="([^"]+?)".+?<meta itemprop="contentURL" content="http[^"]+?.wistia.com\/deliveries\/(.+?)\.bin"/;
const patternGetVideoDataLessonsCourseEgghead = /egghead.io\/lessons\/([^\?]*)/;
const patternGetAuthTokenEgghead = /<meta name="csrf-token" content="(.*)" \/>/;

const executorRegExp = (pattern, string) => {
    return pattern.exec(string);
};

module.exports = {
    patternSearchLinkLessonEgghead,
    patternSearchUrlToLessonEgghead,
    patternCountLessonInCourseEgghead,
    patternTitleLessonInCourseEgghead,
    patternGetVideoDataLessonsCourseEgghead,
    patternGetAuthTokenEgghead,
    executorRegExp
};
