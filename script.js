
        // Datos iniciales
        let datos = {
            clientes: [],
            materiales: [],
            inventario: {},
            precios: {},
            transacciones: [],
            inversionInicial: 0
        };

        // Lista de materiales
        const tiposMaterial = [
            "cobre 1a", "cobre 2a", "cobre3a", 
            "bronce amarillo", "bronce rojo", "cable aluminio", 
            "aluminio blando", "radiador aluminio cobre", "rin g aluminio", 
            "rin ch aluminio", "rin aluminio moto", "aluminio macizo", 
            "aluminio traste", "aluminio perfil c/ pintura", "aluminio perfil s/ pintura", 
                "pedaceria aluminio perfil", "moneda nikel", "radiador bronce", "plomo blando", 
            "plomo duro", "antimonio", "zinc", "perfil sucio chatarra"
        ];

        // Inicializar la aplicación
        document.addEventListener('DOMContentLoaded', function() {
            cargarDatos();
            inicializarNavegacion();
            inicializarFormularios();
            inicializarTabs();
            inicializarModales();
            actualizarInterfaz();
        });

        // Cargar datos desde localStorage
        function cargarDatos() {
            const datosGuardados = localStorage.getItem('datosReciclaje');
            if (datosGuardados) {
                datos = JSON.parse(datosGuardados);
            } else {
                // Inicializar precios por defecto
                tiposMaterial.forEach(material => {
                    datos.precios[material] = {
                        kilo: 0,
                        pieza: 0
                    };
                });
                
                // Inicializar inventario
                tiposMaterial.forEach(material => {
                    datos.inventario[material] = {
                        kilos: 0,
                        piezas: 0
                    };
                });
                
                guardarDatos();
            }
        }

        // Guardar datos en localStorage
        function guardarDatos() {
            localStorage.setItem('datosReciclaje', JSON.stringify(datos));
        }

        // Navegación entre secciones
        function inicializarNavegacion() {
            const botonesNav = document.querySelectorAll('.nav-btn');
            botonesNav.forEach(boton => {
                boton.addEventListener('click', function() {
                    const seccionId = this.getAttribute('data-section');
                    
                    // Remover clase active de todos los botones y secciones
                    botonesNav.forEach(btn => btn.classList.remove('active'));
                    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
                    
                    // Agregar clase active al botón y sección seleccionados
                    this.classList.add('active');
                    document.getElementById(seccionId).classList.add('active');
                });
            });
        }

        // Inicializar pestañas en la sección de inventario
        function inicializarTabs() {
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    
                    // Remover clase active de todas las pestañas y contenidos
                    tabs.forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                    
                    // Agregar clase active a la pestaña y contenido seleccionados
                    this.classList.add('active');
                    document.getElementById(`${tabId}-tab`).classList.add('active');
                });
            });
        }

        // Inicializar modales
        function inicializarModales() {
            const modales = document.querySelectorAll('.modal');
            const cerrarModales = document.querySelectorAll('.close-modal');
            
            cerrarModales.forEach(cerrar => {
                cerrar.addEventListener('click', function() {
                    modales.forEach(modal => modal.style.display = 'none');
                });
            });
            
            // Cerrar modal al hacer clic fuera del contenido
            window.addEventListener('click', function(event) {
                modales.forEach(modal => {
                    if (event.target === modal) {
                        modal.style.display = 'none';
                    }
                });
            });
        }

        // Inicializar formularios
        function inicializarFormularios() {
            // Formulario de clientes
            document.getElementById('cliente-form').addEventListener('submit', function(e) {
                e.preventDefault();
                registrarCliente();
            });
            
            // Formulario de materiales
            document.getElementById('material-form').addEventListener('submit', function(e) {
                e.preventDefault();
                registrarMaterial();
            });
            
            // Formulario de precios
            document.getElementById('form-precio').addEventListener('submit', function(e) {
                e.preventDefault();
                guardarPrecio();
            });
            
            // Formulario de transacciones
            document.getElementById('form-transaccion').addEventListener('submit', function(e) {
                e.preventDefault();
                registrarTransaccion();
            });
            
            // Botón para nueva transacción
            document.getElementById('btn-nueva-transaccion').addEventListener('click', function() {
                abrirModalTransaccion();
            });
            
            // Botón para generar reporte
            document.getElementById('btn-generar-reporte').addEventListener('click', function() {
                generarReporte();
            });
            
            // Botón para descargar Excel
            document.getElementById('btn-descargar-excel').addEventListener('click', function() {
                descargarExcel();
            });
        }

        // Actualizar la interfaz con los datos actuales
        function actualizarInterfaz() {
            actualizarListaClientes();
            actualizarSelectClientes();
            actualizarSelectMateriales();
            actualizarTablaMateriales();
            actualizarInventario();
            actualizarListaPrecios();
            actualizarFinanzas();
        }

        // Registrar un nuevo cliente
        function registrarCliente() {
            const nombre = document.getElementById('cliente-nombre').value;
            const telefono = document.getElementById('cliente-telefono').value;
            const email = document.getElementById('cliente-email').value;
            const direccion = document.getElementById('cliente-direccion').value;
            
            const nuevoCliente = {
                id: Date.now(),
                nombre,
                telefono,
                email,
                direccion,
                fechaRegistro: new Date().toISOString().split('T')[0]
            };
            
            datos.clientes.push(nuevoCliente);
            guardarDatos();
            actualizarInterfaz();
            
            // Limpiar formulario
            document.getElementById('cliente-form').reset();
            
            // Mostrar mensaje de éxito
            mostrarAlerta('Cliente registrado exitosamente', 'success');
        }

        // Actualizar la lista de clientes en la tabla
        function actualizarListaClientes() {
            const tbody = document.querySelector('#tabla-clientes tbody');
            tbody.innerHTML = '';
            
            datos.clientes.forEach(cliente => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${cliente.id}</td>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.email}</td>
                    <td>
                        <button class="danger" onclick="eliminarCliente(${cliente.id})">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Actualizar el select de clientes en el formulario de materiales
        function actualizarSelectClientes() {
            const select = document.getElementById('material-cliente');
            select.innerHTML = '<option value="">Seleccione un cliente</option>';
            
            datos.clientes.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.id;
                option.textContent = cliente.nombre;
                select.appendChild(option);
            });
        }

        // Actualizar el select de materiales
        function actualizarSelectMateriales() {
            const select = document.getElementById('material-tipo');
            select.innerHTML = '<option value="">Seleccione un material</option>';
            
            tiposMaterial.forEach(material => {
                const option = document.createElement('option');
                option.value = material;
                option.textContent = material.charAt(0).toUpperCase() + material.slice(1);
                select.appendChild(option);
            });
            
            // Actualizar precio cuando se selecciona un material
            select.addEventListener('change', function() {
                const material = this.value;
                if (material && datos.precios[material]) {
                    const unidad = document.getElementById('material-unidad').value;
                    document.getElementById('material-precio').value = datos.precios[material][unidad];
                }
            });
            
            // Actualizar precio cuando cambia la unidad
            document.getElementById('material-unidad').addEventListener('change', function() {
                const material = document.getElementById('material-tipo').value;
                if (material && datos.precios[material]) {
                    document.getElementById('material-precio').value = datos.precios[material][this.value];
                }
            });
        }

        // Registrar un nuevo material
        function registrarMaterial() {
            const clienteId = parseInt(document.getElementById('material-cliente').value);
            const tipo = document.getElementById('material-tipo').value;
            const cantidad = parseFloat(document.getElementById('material-cantidad').value);
            const unidad = document.getElementById('material-unidad').value;
            const precio = parseFloat(document.getElementById('material-precio').value);
            
            const cliente = datos.clientes.find(c => c.id === clienteId);
            if (!cliente) {
                mostrarAlerta('Seleccione un cliente válido', 'error');
                return;
            }
            
            const nuevoMaterial = {
                id: Date.now(),
                clienteId,
                clienteNombre: cliente.nombre,
                tipo,
                cantidad,
                unidad,
                precio,
                total: cantidad * precio,
                fecha: new Date().toISOString().split('T')[0]
            };
            
            datos.materiales.push(nuevoMaterial);
            
            // Actualizar inventario - CORRECCIÓN APLICADA AQUÍ
            if (!datos.inventario[tipo]) {
                datos.inventario[tipo] = { kilos: 0, piezas: 0 };
            }
            
            if (unidad === 'kilo') {
                datos.inventario[tipo].kilos += cantidad;
            } else {
                datos.inventario[tipo].piezas += cantidad;
            }
            
            // Registrar transacción de gasto
            const transaccion = {
                id: Date.now(),
                tipo: 'gasto',
                descripcion: `Compra de ${cantidad} ${unidad}(s) de ${tipo} a ${cliente.nombre}`,
                monto: nuevoMaterial.total,
                fecha: nuevoMaterial.fecha
                
            };
            
            datos.transacciones.push(transaccion);
            
            guardarDatos();
            actualizarInterfaz();
            
            // Limpiar formulario
            document.getElementById('material-form').reset();
            
            // Mostrar mensaje de éxito
            mostrarAlerta('Material registrado exitosamente', 'success');
        }

        // Actualizar la tabla de materiales
        function actualizarTablaMateriales() {
            const tbody = document.querySelector('#tabla-materiales tbody');
            tbody.innerHTML = '';
            
            const hoy = new Date().toISOString().split('T')[0];
            const materialesHoy = datos.materiales.filter(m => m.fecha === hoy);
            
            materialesHoy.forEach(material => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${material.fecha}</td>
                    <td>${material.clienteNombre}</td>
                    <td>${material.tipo}</td>
                    <td>${material.cantidad} ${material.unidad}</td>
                    <td>$${material.precio.toFixed(2)}</td>
                    <td>$${material.total.toFixed(2)}</td>
                    <td>
                        <button class="danger" onclick="eliminarMaterial(${material.id})">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Actualizar el inventario - CORRECCIÓN APLICADA AQUÍ
        function actualizarInventario() {
            const lista = document.getElementById('lista-inventario');
            lista.innerHTML = '';
            
            // Calcular el stock actual a partir de los materiales registrados
            const stockCalculado = {};
            
            // Inicializar todos los materiales con stock 0
            tiposMaterial.forEach(material => {
                stockCalculado[material] = {
                    kilos: 0,
                    piezas: 0
                };
            });
            
            // Sumar todos los materiales registrados
            datos.materiales.forEach(material => {
                if (stockCalculado[material.tipo]) {
                    if (material.unidad === 'kilo') {
                        stockCalculado[material.tipo].kilos += material.cantidad;
                    } else {
                        stockCalculado[material.tipo].piezas += material.cantidad;
                    }
                }
            });
            
            // Actualizar el inventario con los valores calculados
            datos.inventario = stockCalculado;
            
            // Mostrar el inventario en la interfaz
            Object.entries(datos.inventario).forEach(([material, stock]) => {
                const item = document.createElement('div');
                item.className = 'material-item';
                item.innerHTML = `
                    <div class="material-info">
                        <strong>${material.charAt(0).toUpperCase() + material.slice(1)}</strong>
                        <div>Stock por kilos: ${stock.kilos.toFixed(2)}</div>
                        <div>Stock por piezas: ${stock.piezas}</div>
                    </div>
                `;
                lista.appendChild(item);
            });
        }

        // Actualizar la lista de precios
        function actualizarListaPrecios() {
            const lista = document.getElementById('lista-precios');
            lista.innerHTML = '';
            
            tiposMaterial.forEach(material => {
                const precio = datos.precios[material] || { kilo: 0, pieza: 0 };
                
                const item = document.createElement('div');
                item.className = 'material-item';
                item.innerHTML = `
                    <div class="material-info">
                        <strong>${material.charAt(0).toUpperCase() + material.slice(1)}</strong>
                        <div>Precio por kilo: $${precio.kilo.toFixed(2)}</div>
                        <div>Precio por pieza: $${precio.pieza.toFixed(2)}</div>
                    </div>
                    <div class="material-actions">
                        <button class="success" onclick="editarPrecio('${material}')">Editar</button>
                    </div>
                `;
                lista.appendChild(item);
            });
        }

        // Abrir modal para editar precio
        function editarPrecio(material) {
            const precio = datos.precios[material] || { kilo: 0, pieza: 0 };
            
            document.getElementById('precio-id').value = material;
            document.getElementById('precio-material').value = material.charAt(0).toUpperCase() + material.slice(1);
            document.getElementById('precio-kilo').value = precio.kilo;
            document.getElementById('precio-pieza').value = precio.pieza;
            
            document.getElementById('modal-precio').style.display = 'flex';
        }

        // Guardar cambios en el precio
        function guardarPrecio() {
            const material = document.getElementById('precio-id').value;
            const precioKilo = parseFloat(document.getElementById('precio-kilo').value);
            const precioPieza = parseFloat(document.getElementById('precio-pieza').value);
            
            datos.precios[material] = {
                kilo: precioKilo,
                pieza: precioPieza
            };
            
            guardarDatos();
            actualizarInterfaz();
            
            document.getElementById('modal-precio').style.display = 'none';
            mostrarAlerta('Precio actualizado exitosamente', 'success');
        }

        // Actualizar la sección de finanzas
        function actualizarFinanzas() {
            // Calcular totales
            let inversión = 2000;
            let ingresos = 0;
            let gastos = 0;
            
            datos.transacciones.forEach(transaccion => {
                if (transaccion.tipo === 'ingreso') {
                    ingresos += transaccion.monto;
                } else {
                    gastos += transaccion.monto;
                }
            });
            
            const balance = ingresos - gastos;
            
            // Actualizar estadísticas
            document.getElementById('inversion-inicial').textContent = `$${datos.inversionInicial.toFixed(2)}`;
            document.getElementById('ingresos-totales').textContent = `$${ingresos.toFixed(2)}`;
            document.getElementById('gastos-totales').textContent = `$${gastos.toFixed(2)}`;
            document.getElementById('balance-actual').textContent = `$${balance.toFixed(2)}`;
            
            // Actualizar tabla de transacciones
            const tbody = document.querySelector('#tabla-transacciones tbody');
            tbody.innerHTML = '';
            
            datos.transacciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).forEach(transaccion => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${transaccion.fecha}</td>
                    <td>${transaccion.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}</td>
                    <td>${transaccion.descripcion}</td>
                    <td>$${transaccion.monto.toFixed(2)}</td>
                    <td>
                        <button class="danger" onclick="eliminarTransaccion(${transaccion.id})">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Abrir modal para nueva transacción
        function abrirModalTransaccion() {
            document.getElementById('transaccion-fecha').value = new Date().toISOString().split('T')[0];
            document.getElementById('modal-transaccion').style.display = 'flex';
        }

        // Registrar una nueva transacción
        function registrarTransaccion() {
            const tipo = document.getElementById('transaccion-tipo').value;
            const descripcion = document.getElementById('transaccion-descripcion').value;
            const monto = parseFloat(document.getElementById('transaccion-monto').value);
            const fecha = document.getElementById('transaccion-fecha').value;
            
            const nuevaTransaccion = {
                id: Date.now(),
                tipo,
                descripcion,
                monto,
                fecha
            };
            
            datos.transacciones.push(nuevaTransaccion);
            guardarDatos();
            actualizarInterfaz();
            
            document.getElementById('modal-transaccion').style.display = 'none';
            document.getElementById('form-transaccion').reset();
            
            mostrarAlerta('Transacción registrada exitosamente', 'success');
        }

        // Generar reporte de corte de caja
        function generarReporte() {
            const fechaInicio = document.getElementById('fecha-inicio').value;
            const fechaFin = document.getElementById('fecha-fin').value;
            
            if (!fechaInicio || !fechaFin) {
                mostrarAlerta('Seleccione ambas fechas', 'error');
                return;
            }
            
            const transaccionesFiltradas = datos.transacciones.filter(t => {
                return t.fecha >= fechaInicio && t.fecha <= fechaFin;
            });
            
            const materialesFiltrados = datos.materiales.filter(m => {
                return m.fecha >= fechaInicio && m.fecha <= fechaFin;
            });
            
            let ingresos = 0;
            let gastos = 0;
            
            transaccionesFiltradas.forEach(t => {
                if (t.tipo === 'ingreso') {
                    ingresos += t.monto;
                } else {
                    gastos += t.monto;
                }
            });
            
            const resumen = document.getElementById('resumen-corte');
            resumen.innerHTML = `
                <div class="stats">
                    <div class="stat-card">
                        <h4>Ingresos</h4>
                        <p>$${ingresos.toFixed(2)}</p>
                    </div>
                    <div class="stat-card">
                        <h4>Gastos</h4>
                        <p>$${gastos.toFixed(2)}</p>
                    </div>
                    <div class="stat-card">
                        <h4>Balance</h4>
                        <p>$${(ingresos - gastos).toFixed(2)}</p>
                    </div>
                    <div class="stat-card">
                        <h4>Transacciones</h4>
                        <p>${transaccionesFiltradas.length}</p>
                    </div>
                </div>
                <h4>Materiales adquiridos en el período:</h4>
                <ul>
                    ${materialesFiltrados.map(m => `<li>${m.cantidad} ${m.unidad}(s) de ${m.tipo} - $${m.total.toFixed(2)}</li>`).join('')}
                </ul>
            `;
        }

        // Descargar datos a Excel (simulado)
        function descargarExcel() {
            // En una implementación real, aquí se conectaría con Google Drive API
            // Por ahora, simulamos la descarga creando un archivo de texto con los datos
            
            const fechaInicio = document.getElementById('fecha-inicio').value;
            const fechaFin = document.getElementById('fecha-fin').value;
            
            if (!fechaInicio || !fechaFin) {
                mostrarAlerta('Seleccione ambas fechas', 'error');
                return;
            }
            
            const contenido = `
                REPORTE DE RECICLAJE - ${fechaInicio} a ${fechaFin}
                
                CLIENTES:
                ${datos.clientes.map(c => `${c.id},${c.nombre},${c.telefono},${c.email},${c.direccion}`).join('\n')}
                
                MATERIALES:
                ${datos.materiales.filter(m => m.fecha >= fechaInicio && m.fecha <= fechaFin)
                    .map(m => `${m.fecha},${m.clienteNombre},${m.tipo},${m.cantidad},${m.unidad},${m.precio},${m.total}`).join('\n')}
                
                INVENTARIO:
                ${Object.entries(datos.inventario).map(([material, stock]) => 
                    `${material},${stock.kilos},${stock.piezas}`).join('\n')}
                
                FINANZAS:
                ${datos.transacciones.filter(t => t.fecha >= fechaInicio && t.fecha <= fechaFin)
                    .map(t => `${t.fecha},${t.tipo},${t.descripcion},${t.monto}`).join('\n')}
            `;
            
            const blob = new Blob([contenido], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reporte_reciclaje_${fechaInicio}_a_${fechaFin}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            mostrarAlerta('Archivo descargado (simulación). En una implementación real se guardaría en Google Drive.', 'success');
        }

        // Eliminar un cliente
        function eliminarCliente(id) {
            if (confirm('¿Está seguro de que desea eliminar este cliente?')) {
                datos.clientes = datos.clientes.filter(c => c.id !== id);
                guardarDatos();
                actualizarInterfaz();
                mostrarAlerta('Cliente eliminado exitosamente', 'success');
            }
        }

        // Eliminar una transacción
        function eliminarTransaccion(id) {
            if (confirm('¿Está seguro de que desea eliminar esta transacción?')) {
                datos.transacciones = datos.transacciones.filter(t => t.id !== id);
                guardarDatos();
                actualizarInterfaz();
                mostrarAlerta('Transacción eliminada exitosamente', 'success');
            }
        }

        // Eliminar material
        function eliminarMaterial(id) {
            if (confirm('¿Está seguro de que desea eliminar este material?')) {
                const material = datos.materiales.find(m => m.id === id);
                if (material) {
                    // Restar del inventario
                    if (datos.inventario[material.tipo]) {
                        if (material.unidad === 'kilo') {
                            datos.inventario[material.tipo].kilos -= material.cantidad;
                        } else {
                            datos.inventario[material.tipo].piezas -= material.cantidad;
                        }
                    }
                    
                    // Eliminar transacción asociada
                    datos.transacciones = datos.transacciones.filter(t => 
                        !(t.descripcion.includes(`Compra de ${material.cantidad} ${material.unidad}(s) de ${material.tipo} a ${material.clienteNombre}`))
                    );
                }
                
                datos.materiales = datos.materiales.filter(m => m.id !== id);
                guardarDatos();
                actualizarInterfaz();
                mostrarAlerta('Material eliminado exitosamente', 'success');
            }
        }

        // Mostrar alerta
        function mostrarAlerta(mensaje, tipo) {
            // Crear elemento de alerta
            const alerta = document.createElement('div');
            alerta.className = `alert alert-${tipo === 'success' ? 'success' : 'error'}`;
            alerta.textContent = mensaje;
            
            // Insertar al principio del contenedor
            const container = document.querySelector('.container');
            container.insertBefore(alerta, container.firstChild);
            
            // Eliminar después de 3 segundos
            setTimeout(() => {
                alerta.remove();
            }, 3000);
        }

    
