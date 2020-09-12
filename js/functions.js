    /**
 * Accepts either a URL or querystring and returns an object associating 
 * each querystring parameter to its value. 
 *
 * Returns an empty object if no querystring parameters found.
 */
function getUrlParams(urlOrQueryString) {
    if ((i = urlOrQueryString.indexOf('?')) >= 0) {
      const queryString = urlOrQueryString.substring(i+1);
      if (queryString) {
        return _mapUrlParams(queryString);
      } 
    }
  
    return {};
  }
  
  function getUrlParameters(parameter, staticURL, decode){
    /*
     Function: getUrlParameters
     Descrição: Obtem o valor dos parâmetros da URL atual ou URL estática
     Author: Tirumal
     URL: www.code-tricks.com
    */
    var currLocation = (staticURL.length)? staticURL : window.location.search,
        parArr = currLocation.split("?")[1].split("&"),
        returnBool = true;
 
    for(var i = 0; i < parArr.length; i++){
         parr = parArr[i].split("=");
         if(parr[0] == parameter){
             return (decode) ? decodeURIComponent(parr[1]) : parr[1];
             returnBool = true;
         }else{
             returnBool = false;            
         }
    }
 
    if(!returnBool) return false;  
 }

  // home.html function
  function getAllCourses(data){
      array = data["courses"];
      var c = new Object();
      array.forEach(course => {
          c[course.course_name] = getCourseSize(course);
      });
      return c;
  }

  function getCourseSize(course){
    array = course["subjects"];
    tamanho = 0;
      array.forEach(element => {
          tamanho += element["users"]["students"].length;
      });
      return tamanho;
  }

  function getCourseByName(data,course){
    array = data["courses"];
    var c = new Object();
    array.forEach(element => {
      if (element.course_name == course){
        c = element;
      }
    });
    return c;
  }

  function getSubjectByNameInCourse(courseObject, subject){
    array = courseObject["subjects"];
    var s = new Object();
    array.forEach(element => {
      if (element.subject_name == subject){
        s = element;
      }
    });
    return s;
  }

  function getSubjectsByCourse(data,course){
    array = data["courses"];
    subjects = [];
    array.forEach(element => {
      if (element.course_name == course){
        subjects = element.subjects;
      }  
    });
    subs = [];
    subjects.forEach(element => {
      var s = new Object();
      s["name"] = element.subject_name;
      s["value"] = element.users.students.length;
      subs.push(s);
    });
    return subs;
  }

  function getUserAccessBySubject(data, course, subject){
    //array = data["courses"].course_name.["subjects"].subject_name
    courseObject = getCourseByName(data,course);
    subjectObject = getSubjectByNameInCourse(courseObject, subject);
    users = subjectObject["users"].students;
    dados = [];
    users.forEach(element => {
      var u = new Object();
      u["category"] = element.firstname;
      u["value"] = element.n_access.length;
      dados.push(u);
    });
    return dados;
  }



