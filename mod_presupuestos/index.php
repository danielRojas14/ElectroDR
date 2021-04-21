<?php require_once '../layouts/head.php';   ?>

<?php 
require_once '../conexion/conexion.php';
$sqlNegocio = "SELECT * FROM negocio";
$resultNegocio = $conexion->query($sqlNegocio);
?>

<div class="container" style="margin-bottom: 5%; background-color:#C2C2C2;border-radius: 0.50rem;padding-top: 15px; padding-left:15px; padding-right:15px; padding-bottom:15px;">
	<div class="row">
		<div class="col-md-12">
			<div class="form-group">
				<label for="negocioPresupuesto">Seleccione un Negocio</label>
				<select class="form-control" id="negocioPresupuesto" name="negocioPresupuesto">
					<option selected disabled value="0">Elija un Negocio:</option>
					<?php while($rowNegocio = $resultNegocio->fetch_assoc()): ?>
						<option value="<?php echo $rowNegocio['id_negocio'] ?>"><?php echo $rowNegocio['descrip_negocio']; ?></option>
					<?php endwhile ?>
				</select>
			</div>
			<br>
		</div>
		<div id="tablaResultBusqueda" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			
		</div>
		<div id="tarjetaResultPresupuesto" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			
		</div>
	</div>
</div>








<?php require_once '../layouts/footer.php' ; ?>