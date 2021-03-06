$(document).ready(function () {
  localStorage.clear();

  $("#negocioPresupuesto").on("change", function (e) {
    const valor = $(this).children("option:selected").text();

    realizarPeticion(valor);
  });

  const realizarPeticion = (descripcionNegocio) => {
    const data = {
      terminoBusqueda: descripcionNegocio,
    };

    $.ajax({
      type: "POST",
      url: "../mod_presupuestos/buscadorProductos.php",
      data: data,
      success: function (response) {
        armarTabla(JSON.parse(response));
      },
      error: function () {
        console.log("No se ha podido obtener la información");
      },
    });
  };

  const armarTabla = (datosTabla) => {
    // console.log(datosTabla)
    const divTabla = $("#tablaResultBusqueda");

    let tabla = `
		<div style='background-color:#D4E6F1;border-radius: 0.50rem;padding-top: 15px; padding-left:15px; padding-right:15px; padding-bottom:15px; '>
		<h1 class="page-header text-center">Realizar Presupuesto</h1>
		<table id="myTable" class="table table-bordered table-striped display wrap"  width="100%">
		<thead>
		<td>Imagen</td>
		<td>Nombre Producto</td>
		<td>Descripcion Producto</td>
		<td>Marca</td>
		<td>Descripcion Negocio</td>
		<td>Precio</td>
		<td>Fecha Modificacion</td>
		</thead>
		<tbody>`;

    for (let i = 0; i < datosTabla.length; i++) {
      const {
        desc_produc,
        descrip_negocio,
        fecha_modificacion,
        descrip_marca,
        nombre,
        precio,
        ruta_img,
        id_productos,
      } = datosTabla[i];

      tabla += `
			<tr>
			<td><img style='width:100px; border-radius:0.50rem;' src="${ruta_img}"</td>	
			<td><a class="btnProducto" data-IdProducto="${id_productos}"  href="#">${nombre}</a></td>	
			<td>${desc_produc}</td>	
			<td>${descrip_marca}</td>	
			<td>${descrip_negocio}</td>	
			<td>${precio}</td>	
			<td>${fecha_modificacion}</td>	
			</tr>
			`;
    }

    tabla += `
		
		</div>`;
    divTabla.html(`${tabla}`);
    // dataTable.;
    $("#myTable").DataTable({ responsive: true });
  };

  $(document).on("click", ".btnProducto", function (e) {
    let nombreProducto = e.target.text;
    let idProducto = e.target.getAttribute("data-IdProducto");
    let datosProductos = [];
    // console.log(idProducto)

    $(this)
      .parents("tr")
      .find("td")
      .each(function () {
        datosProductos.push($(this).html());
      });

    datosProductos.splice(0, 2);
    datosProductos.unshift(nombreProducto);
    let cantProducto;
    while (true) {
      cantProducto = prompt("Ingrese la cantidad de productos: ");

      if (
        !isNaN(cantProducto) &&
        cantProducto != null &&
        cantProducto != "" &&
        cantProducto > 0 &&
        (!cantProducto / 1 == 0 || Number.isInteger(parseFloat(cantProducto)))
      ) {
        break;
      } else if (!cantProducto) {
        return;
      } else {
        alert("Ingrese un numero valido para las cantidades de|l producto!");
        continue;
      }
    }

    datosProductos.push(cantProducto);

    localStorage.setItem(
      "nombreNegocio",
      $("#negocioPresupuesto option:selected").text()
    );
    localStorage.setItem(idProducto, datosProductos);

    aniadirProductoAlPresupuesto();
    $("html, body").animate({ scrollTop: $(this).offset().top }, 600);
  });

  const aniadirProductoAlPresupuesto = () => {
    const tarjetaPresupuestoFinal = $("#tarjetaResultPresupuesto");
    let precioTotal = 0;
    let tablaPresupuestoFinal = "";
    let nombreNegocio = localStorage.getItem("nombreNegocio");

    tablaPresupuestoFinal = `
		<br>
		<div class="tablaPdf card text-center" style='background:#D4E6F1';>
		<div class="card-header">
		<h1>Presupuesto</h1>
		</div>
		<div class="card-body">
		<h5 class="card-title">Listado de Productos </h5>
		<div class="table-responsive">
		<table id="myTableProductos"  class="table table-bordered table-dark table-striped display wrap" width="100%">
		<thead>
		<tr>
		<th scope="col">Nombre Producto</th>
		<th scope="col">Descripcion Producto</th>
		<th scope="col">Marca</th>
		<th scope="col">Cantidad</th>
		<th scope="col">Precio Unico</th>
		<th scope="col">Precio Total</th>
		<th scope="col">Eliminar</th>
		</tr>
		</thead>
		<tbody>

		`;

    for (let i = 0; i < localStorage.length; i++) {
      let clave = localStorage.key(i);
      if (clave != "nombreNegocio") {
        let resultProductos = localStorage.getItem(clave);

        arrayResultProductos = resultProductos.split(",");

        precioTotal += parseFloat(
          arrayResultProductos[4] * parseFloat(arrayResultProductos[6])
        );

        tablaPresupuestoFinal += `<hr>
				<tr style='background-color:#5DADE2;'">
				<td scope="row">${arrayResultProductos[0]}</td>
				<td>${arrayResultProductos[1]}</td>
				<td>${arrayResultProductos[2]}</td>
				<td>${arrayResultProductos[6]}</td>
				<td>$ ${parseFloat(arrayResultProductos[4])}</td>
				<td>$ ${
          parseFloat(arrayResultProductos[4]) *
          parseFloat(arrayResultProductos[6])
        }</td>
				<td><input type="button" value="Borrar" data-idListadoProductos="${clave}" class="borrarProducto btn btn-danger"></td></td>
				</tr>`;
      }
    }

    tablaPresupuestoFinal += `
		</tbody>
		</table>
		</div>
		<input type="button" name="limpiarListaPresupuest" id="limpiarListaPresupuesto" class="btn btn-warning" value="Vaciar Lista">
		<input type="button" name="pdfListaPresupuest" data-toggle="modal" data-target="#imprimirLista" id="pdfListaPresupuesto" class="btn btn-info" value="imprimir Lista">

		</div>
		<div class="card-footer">
		<h5>Presupuesto Final es de $ ${precioTotal}</h5>
		</div>
		</div>`;

    tarjetaPresupuestoFinal.html(tablaPresupuestoFinal);
    $("#myTableProductos").DataTable({ responsive: true });
  };

  $(document).on("click", "#limpiarListaPresupuesto", function (e) {
    if (confirm("¿Desea Borrar todos los datos del Presupuesto?") == true) {
      localStorage.clear();

      aniadirProductoAlPresupuesto();
    }
  });

  $(document).on("click", ".borrarProducto", function (e) {
    let idProductoLista = e.target.getAttribute("data-idListadoProductos");

    if (confirm("¿Desea Borrar este producto del Presupuesto?") == true) {
      localStorage.removeItem(idProductoLista);
      aniadirProductoAlPresupuesto();

      localStorage.removeItem(idProductoLista);
      aniadirProductoAlPresupuesto();
    }
  });

  $(".form-control").keypress(function (e) {
    if (e.charCode == 44) {
      return false;
    }
  });

  // $('.btnProductosCalcular').on('click', function(event) {
  // 	event.preventDefault();
  // 	alert('dasd')

  // });

  $(document).on("click", "#imprimir", function (e) {
    const nomCliente = document.getElementById("nomCliente").value;
    const tipoComprobante = document.getElementById("tipoComprobante").value;
    const alertNombre = document.getElementById("alertNombre");
    const alertComprobante = document.getElementById("alertComprobantes");
    const formModal = document.getElementById("formModal");
    const botonImprimir = document.getElementById("imprimir");

    pattern = "[a-zA-Z ]{2,254}";

    if (!nomCliente.match(pattern)) {
      alertNombre.style.display = "block";
      alertNombre.innerHTML = "El nombre no es correcto";
      alertNombre.className = "text text-danger";
    } else if (tipoComprobante == 0) {
      alertComprobante.style.display = "block";
      alertComprobante.innerHTML = "Debe seleccionar una opcion";
      alertComprobante.className = "text text-danger";
    } else {
      alertComprobante.style.display = "none";
      alertNombre.style.display = "none";

      // console.log(tipoComprobante);

      const nombreNegocio = $("#negocioPresupuesto")
        .children("option:selected")
        .text();
      let datosParaImprimir = [];
      for (let i = 0; i < localStorage.length; i++) {
        let clave = localStorage.key(i);
        if (clave != "nombreNegocio") {
          let resultProductos = localStorage.getItem(clave);

          arrayResultProductos = resultProductos.split(",");

          datosParaImprimir.push(arrayResultProductos);
        }
      }
      // console.log(datosParaImprimir)
      const data = {
        datosParaImprimir: datosParaImprimir,
      };

      const caracteristicas =
        "height=700,width=800,scrollTo,resizable=1,scrollbars=1,location=0";
      window.open(
        `../mod_presupuestos/imprimir.php?datosParaImprimir=${JSON.stringify(
          datosParaImprimir
        )}&tipoComprobante=${parseFloat(
          tipoComprobante
        )}&nombreNegocio=${nombreNegocio}&nombreCliente=${nomCliente}`,
        "Popup",
        caracteristicas
      );
      return false;
    }
  });
});

window.onbeforeunload = function () {
  return "¿Desea recargar la página web?";
};
