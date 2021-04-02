module.exports = {
    seleccionarSkills : (seleccionadas = [], opciones) => {
        const skills = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 
            'JavaScript', 'jQuery', 'NodeJS', 'SailsJS', 'Angular', 'VueJS', 
            'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL', 
            'TypeScript', 'PHP', 'Laravel', 'Symfony', 'Python', 
            'Django', 'ORM', 'Sequelize', 'Mongoose', 'SQL', 'MVC', 
            'SASS', 'WordPress'
        ];

        let html = '';
        skills.forEach(skill => {
            //revisa si el arreglo de seleccionadas existe en skills
            //si es asi le manda la clase de activo si no no hace nada
            html += `
                <li ${seleccionadas.includes(skill) ? ' class="activo"' : ''}>${skill}</li>
            `;
        });

        return opciones.fn().html = html;
    },


    tipoContrato: (selecionado, opciones) => {
        //opcines todo el html 
        return opciones.fn(this).replace(
            new RegExp(`value="${selecionado}"`), '$& selected= "selected"'
        )
    },

    mostrarAlertas: (errores = {}, alertas ) => {
        const categoria = Object.keys(errores);//arreglo de objetos
        let html = '';

        if (categoria.length) {
            errores[categoria].forEach(error => {//iterracion de todos los errores 
                html += `<div class= "${categoria} alerta">
                    ${error}
                </div>`
            })
        }

        return alertas.fn().html = html;
    }
}