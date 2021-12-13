let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();
const api_key = "818f24b314ea8ff573eda2533680127b";
const base_url = "https://api.openweathermap.org/data/2.5/weather";
const generateBtn = document.getElementById("generate");
let zipCodeInput = document.getElementById("zip");
let feelingsInput = document.getElementById("feelings");
let zipCodeError = document.getElementById("zip_code_error");
let feelingsError = document.getElementById("feelings_error");
let entryHolder = document.getElementById("entryHolder");
/**
 * create query param string from
 * the given object
 *
 * @param {Object} query
 * @returns {string}
 */
function createQueryParams(query = {}) {
  let queryString = [];
  for (let key in query) {
    queryString.push(`${key}=${query[key]}`);
  }
  return queryString.join("&");
}

/**
 * validating the given input
 *
 * loop through rules container if type of rule
 * is not a function it will through a type error
 * if error function does't return a true it will be considered
 * as error else it will be a valid input
 *
 *
 * @param {String} selector [element selector]
 * @param {Object} rules  [rules container]
 * @param {Object} messages [message container]
 * @returns {string|null}
 * @throws {TypeError} [if rule is not a type of function]
 */
function validateInput(selector, rules = {}, messages = {}) {
  /** get input and input value */
  let input = document.querySelector(selector);
  let val = input.value;

  /** errors container */
  let errors = [];

  /**
   * looping through rules
   */
  for (let key in rules) {
    let rule = rules[key];
    if (typeof rule !== "function") {
      throw new TypeError("Validation rule must be a function");
    }
    if (!rule(val)) {
      errors.push(key);
    }
  }

  /**
   * if validations has errors it will
   * return null else it will return input value
   */
  if (errors.length) {
    input.classList.add("error");
    document.querySelector(`${selector}_error`).innerHTML =
      messages[errors[0]] || "required";
    return null;
  } else {
    input.classList.remove("error");
    document.querySelector(`${selector}_error`).innerHTML = "";
    return val;
  }
}

/**
 * get temperature from open weather map api
 *
 *
 *
 * @param {String} url
 * @param {number} zip
 * @param {string} api_key
 * @returns {Promise}
 * @throws {Error} [if error in api_key or zip code]
 */
async function getTemperature(url, zip, api_key) {
  try {
    let request = await fetch(
      url + "?" + createQueryParams({ zip, appid: api_key, units: "metric" })
    );
    let response = await request.json();
    return response;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * post data to server
 * 
 * @param {Object} data 
 * @returns {Promise}
 */
async function postDataToServer(data) {
  try {
    let request = await fetch("http://localhost:3000/add", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    let response = await request.json();

    return response;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * get data from server
 * 
 * @returns {Promise}
 */
async function getDataFromServer() {
  try {
    let request = await fetch("http://localhost:3000/data");
    let response = await request.json();
    return response;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * register event listener
 * when user click generate button
 *
 * it will validate zip code and feelings
 *
 * because zip code is required parameter for
 * sending request to OpenWeatherMap api
 *
 */
generateBtn.addEventListener("click", function (e) {
  /** zip code validation */
  let zip = validateInput(
    "#zip",
    {
      required: (val) => val !== null && val !== "",
      number: (val) => val.match(/[0-9]+/),
    },
    {
      required: "Zip code required",
      number: "Zip must be a number",
    }
  );

  /** feelings validation */
  let feelings = validateInput(
    "#feelings",
    {
      required: (val) => val !== null && val !== "",
    },
    {
      required: "Feelings required",
    }
  );

  /**
   * return with no action
   * if no zip code or feelings
   */
  if (!zip) {
    return;
  }
  if (!feelings) {
    return;
  }

  /**
   * get temperature from open weather api
   * 
   * 
   */
  getTemperature(base_url, zip, api_key)
    .then((data) => {
      postDataToServer({
        temperature: data.main.temp,
        date: newDate,
        content: feelings,
      })
        .then((res) => {
          console.log(res);
          getDataFromServer()
            .then((data) => {
              entryHolder.innerHTML = `
          <div id="date"> <span data-feather="calendar"></span> Date: ${data.date}</div>
          <div id="temp"> <span data-feather="thermometer"></span> Temperature: ${data.temperature} C</div>
          <div id="content"> <span data-feather="message-circle"></span> Content: ${data.content} .</div>
        `;

              feather.replace();
            })
            .catch((err) => {
              entryHolder.innerHTML = `<p class="error">Error in get Data from server</p>`;
            });
        })
        .catch((err) => {
          entryHolder.innerHTML = `<p class="error">Error in Saving data in server</p>`;
        });
    })
    .catch((err) => {
      entryHolder.innerHTML = `<p class="text-error">Error in get temperature from Open Weather Map</p>`;
    });
});
