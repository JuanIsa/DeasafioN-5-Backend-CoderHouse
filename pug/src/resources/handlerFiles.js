'use strict';
import fs from 'fs';

class Contenedor {
    constructor(nameFile) {
        this.nameFile = nameFile;
        this.fileInfo=[]
    }
    async verifyId() {
        try {
            const fileRead = await fs.promises.readFile(`./src/resources/${this.nameFile}`, 'utf-8');
            this.fileInfo = JSON.parse(fileRead);
        } catch (error) {
            console.log(`Hubo un error: ${error}`);
        }
    }
    async save(objeto) {
        let idSet = 0;
        let producto = {
            title: objeto.title,
            price: parseFloat(objeto.price),
            thumbnail: objeto.thumbnail
        };
        await this.verifyId();
        try {
            if (this.fileInfo.length > 0) {
                producto.id = this.fileInfo[this.fileInfo.length - 1].id + 1;
                this.fileInfo.push(producto);
                idSet = this.fileInfo[this.fileInfo.length - 1].id;
            } else {
                this.fileInfo.push({ ...objeto, id: 1 });
                idSet = 1;
            }
            await fs.promises.writeFile(`./src/resources/${this.nameFile}`, JSON.stringify(this.fileInfo), 'utf-8');
            return producto;
        } catch (error) {
            return `Hubo un error: ${error}`;
        }
    }
    async getById(id) {
        let find;
        try {
            const fileRead = await fs.promises.readFile(`./src/resources/${this.nameFile}`, 'utf-8');
            this.fileInfo = JSON.parse(fileRead);
            find = this.fileInfo.find(item => item.id === id);
            if (find) {
                return find;
            } else {
                return { error: 'Producto no encontrado.' };
            }
        } catch (error) {
            return `Hubo un error: ${error}`;
        }
    }
    async updateById(id, producto) {
        let index;
        console.log(id, producto);
        try {
            const fileRead = await fs.promises.readFile(`./src/resources/${this.nameFile}`, 'utf-8');
            this.fileInfo = JSON.parse(fileRead);
            index = this.fileInfo.findIndex(item => item.id === id);
            if (index !== -1) {
                this.fileInfo[index] = { ...producto, id: this.fileInfo[index].id }
                await fs.promises.writeFile(`./src/resources/${this.nameFile}`, JSON.stringify(this.fileInfo), 'utf-8');
                return 'Registro modificado con éxito.';
            } else {
                return { error: 'Producto no encontrado.'};
            }
        } catch (error) {
            return `Hubo un error: ${error}.`;
        }
    }
    async getRandomProduct() {
        try {
            const fileRead = await fs.promises.readFile(`./src/resources/${this.nameFile}`, 'utf-8');
            this.fileInfo = JSON.parse(fileRead);
            return this.fileInfo[Math.floor(Math.random() * this.fileInfo.length)];
        } catch (error) {
            console.log(`Hubo un error: ${error}`);
            return null;
        }
    }
    async getAll() {
        try {
            const fileRead = await fs.promises.readFile(`./src/resources/${this.nameFile}`, 'utf-8');
            this.fileInfo = JSON.parse(fileRead);
            return this.fileInfo;
        } catch (error) {
            return `Hubo un error: ${error}`;
        }
    }
    async deleteById(id) {
        try {
            const fileRead = await fs.promises.readFile(`./src/resources/${this.nameFile}`, 'utf-8');
            this.fileInfo = JSON.parse(fileRead);
            if (this.fileInfo.find(item => item.id === id)) {
                this.fileInfo = this.fileInfo.filter(item => item.id !== id);
                await fs.promises.writeFile(`./src/resources/${this.nameFile}`, JSON.stringify(this.fileInfo), 'utf-8');
                return `Se borró el registro: ${id}`;
            } else {
                return { error: `No existe el registro: ${id}, no se pudo borrar.` };
            }
        } catch (error) {
            return `Hubo un error: ${error}`;
        }
    }
    async deleteAll() {
        await fs.promises.writeFile(`./src/resources/${this.nameFile}`, JSON.stringify([]), 'utf-8');
        console.log('Se borraron todos los objetos del archivo.')
    }
}


export default Contenedor;