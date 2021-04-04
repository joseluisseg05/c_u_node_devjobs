import axios from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.lista-conocimientos');

    //lipiar alertas 
    let alertas = document.querySelector('.alertas');
    if ( alertas ) limpiarAlertas();

    if(skills) {
        skills.addEventListener('click', agregarSkills);

        //editar llama la funcion 
        skillsSeleccionados();
    }

    const vacantesListado = document.querySelector('.panel-administracion');
    if (vacantesListado){
        vacantesListado.addEventListener('click', acccionesListado);
    }
});

const skills = new Set();

const agregarSkills = e => {
    if (e.target.tagName === 'LI') {
        if (e.target.classList.contains('activo')) {
            skills.delete(e.target.textContent);
            e.target.classList.remove('activo');
        } else {
            skills.add(e.target.textContent);
            e.target.classList.add('activo');
        }
    } 
    const skillsArray = [...skills];
    document.querySelector('#skills').value = skillsArray;
}

const skillsSeleccionados = () => {
    const seleccionadas = Array.from(document.querySelectorAll('.lista-conocimientos .activo'));

    seleccionadas.forEach(seleccionada => {
        skills.add(seleccionada.textContent)
    })
    //mostrar en hidden 
    const skillsArray = [...skills];
    document.querySelector('#skills').value= skillsArray;
}

const limpiarAlertas = () => {
    let alertas = document.querySelector('.alertas');
    const interval = setInterval(() => {
        if ( alertas.children.length > 0 ) 
            alertas.removeChild(alertas.children[0])
        else if (alertas.children.length === 0 ) {
            alertas.parentElement.removeChild(alertas);
            clearInterval(interval)
        }
    }, 1500);
}

const acccionesListado = e => {
    e.preventDefault();

    if(e.target.dataset.eliminar) {
        Swal.fire({
            title: 'Confirma la eliminación',
            text: "Una vez eliminada no se podra recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Si! Eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`

                axios.delete( url, {params: {url} })
                    .then(function (respuesta) {
                        if (respuesta.status === 200){
                            Swal.fire(
                                'Eliminado!',
                                respuesta.data,
                                'success'
                            )
                        }   
                        const hijo = e.target.parentElement.parentElement;
                        e.target.parentElement.parentElement.parentElement.removeChild(hijo); 
                    })
                    .catch(() => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Hubo un error.',
                            text: 'No se pudo eliminar la vacante'
                        });
                    })
                    
            }
        })
    } else if(e.target.tagName === 'A') {
        window.location.href = e.target.href;
    }
}
