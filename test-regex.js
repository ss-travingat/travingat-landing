const regex = /^\/(?!api|admin|blog|pricing|templates|_next|static|favicon\.ico).*$/;
console.log("carlos.sails:", regex.test("/carlos.sails"));
console.log("api:", regex.test("/api/hello"));
console.log("blog:", regex.test("/blog/post"));
console.log("pricing:", regex.test("/pricing"));
console.log("favicon:", regex.test("/favicon.ico"));
