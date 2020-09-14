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

  function getUserForumPostBySubject(data,course,subject){
    courseObject = getCourseByName(data,course);
    subjectObject = getSubjectByNameInCourse(courseObject, subject);
    users = subjectObject["users"].students;
    dadosTimestamp = [];
    users.forEach(user => {
      user['n_forum'].forEach(post => {
        dadosTimestamp.push(post);
      });
    });
    dadosTimestamp.sort(function(a, b) {
      return a - b;
    });
    startDate = new Date(dadosTimestamp[0]*1000);
    endDate = new Date(dadosTimestamp[dadosTimestamp.length - 1]*1000);
    var loop = new Date(startDate);
    dados = [];
    var months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
    horarios = ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"];
    while(loop <= endDate){
      for (let i = 0; i < horarios.length; i++) {
        var p = new Object();
        day = loop.getDate()+" "+months[loop.getMonth()]+" "+loop.getFullYear();
        const horario = horarios[i];
        p["day"] = day;
        p["hour"] = horarios[i];
        p["value"] = 0;
        dados.push(p);
      }
      var newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }

    dadosString = [];
    dadosTimestamp.forEach(element => {
      dataTemp = timeConverterForHeatMap(element);
      
      dadosString.push(dataTemp);
    });

    for (let i = 0; i < dados.length; i++) {
      const dado = dados[i];
      count = 0;
      for (let j = 0; j < dadosString.length; j++) {
        const dadoString = dadosString[j];
        day = dadoString.split("-")[0];
        hour = dadoString.split("-")[1];
        // console.log(dado.day+" & "+day);
        // console.log(dado.hour+" & "+hour);
        if (dado.day == day && dado.hour == hour) {
          count++;
        }
      }
      dado.value = count;
    }
    return dados;
  }

  function getUserMessagesBySubject(data ,course, subject){
    courseObject = getCourseByName(data,course);
    subjectObject = getSubjectByNameInCourse(courseObject, subject);
    users = subjectObject["users"].students;
    // array_uab_types = ["to_students","to_tutors_ead","to_teacher_formers","to_tutors_presential","to_teacher_contentist","to_others"]
    dados = [];
    to_students = 0;
    to_tutors_ead = 0;
    to_teacher_formers = 0;
    to_tutors_presential = 0;
    to_teacher_contentist = 0;
    // to_others = 0;
    users.forEach(user => {
      t_message = user['t_message'];
      to_students += t_message.to_students.length;
      to_tutors_ead += t_message.to_tutors_ead.length; 
      to_teacher_formers += t_message.to_teacher_formers.length;
      to_tutors_presential += t_message.to_tutors_presential.length;
      to_teacher_contentist += t_message.to_teacher_contentist.length;
      // to_others += t_message.to_others.length;
    });
    dados = [
      { "from": "Student", "to": "Student", "value": to_students },
      { "from": "Student", "to": "Tutor EAD", "value": to_tutors_ead },
      { "from": "Student", "to": "Formador", "value": to_teacher_formers },
      { "from": "Student", "to": "Tutor Pres.", "value": to_tutors_presential },
      { "from": "Student", "to": "Conteudista", "value": to_teacher_contentist }
      // { "from": "Student", "to": "Outros", "value": to_others }
    ];
    console.log(dados);
    return dados;
  }

  function timeConverterForHeatMap(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var time = date + ' ' + month + ' ' + year + '-' + hour + ':00' ;
    return time;
  }



