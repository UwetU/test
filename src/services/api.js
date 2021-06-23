import axios from "axios";

export default () => {
  return axios.create({
    baseURL: 'https://raw.githubusercontent.com/WilliamRu/TestAPI/'
  })
}