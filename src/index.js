const app = require("./app/app");

// Puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
});
