var faker = require('faker-br');

describe('Lista de usuarios', () => {

    Cypress.config('baseUrl', 'https://serverest.dev')

    it ('Lista de usuario', () => {
        cy.request('GET','/usuarios').then((response) =>{
            expect(response).to.have.property('status', 200)
            expect(response.body).to.not.be.null   
        })
    })  
});

describe('Cadastro de usuario - login - cadastro de produto', function () {
    let name = faker.name.firstName(); //Names fake
    let Email = faker.internet.email();
    let Api_Token
    it('Cadastro usuario code 200', function () {

        cy.request({
            method: 'POST',
            url: 'https://serverest.dev/usuarios',
            form: true,
            body: {
                "nome": `${name}`,
                "email": `${Email}`,
                "password": "teste",
                "administrador": "true",
            }
        }).then(response => {
            expect(response.status).to.eq(201); // Status Validation
        });
    });

it ('Cadastro de usuario code 400', () => {
        
        cy.request({
            method: 'POST',
            url:`/usuarios`,
            failOnStatusCode: false 
          }).then((resp)=>{
            expect(resp.status).to.eq(400);
            expect(resp.statusText).to.equal('Bad Request');
        
        });
    });
    
it('Realizando login Status code 200', function () {

        cy.request({
            method: 'POST',
            url: 'https://serverest.dev/login',
            body: {
                email: `${Email}`,
                password: `teste`,
            }
        }).then(response => {
            let token = response.body.authorization //Get token 
            Api_Token = token
            expect(response.status).to.eq(200); // Status Validation

        });
    });

it('Realizando login Status code 400', function () {

        cy.request({
            method: 'POST',
            url: 'https://serverest.dev/login',
            failOnStatusCode: false,
            body: {
                email: `TestFail${Email}`, // Email errado
                password: `teste`,
            }
        }).then(response => {

            expect(response.status).to.eq(401); // Status Validation

        });
    });

    it('Realizando cadastro de produto', function () {
        let NameProduct = faker.commerce.productName();
        let Description = faker.commerce.productName();
        
        cy.request({
            method: 'POST',
            url: 'https://serverest.dev/produtos',
            failOnStatusCode: false,
            form: true,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `${Api_Token}`
            },
            body: {
                "nome": `${NameProduct}`,
                "preco": "470",
                "descricao": `${Description}`,
                "quantidade": "5"
            }
        }).then(response => {
            expect(response.status).to.eq(201); // Status Validation
            expect(response.body.message).to.equal("Cadastro realizado com sucesso");
        });
    });
});