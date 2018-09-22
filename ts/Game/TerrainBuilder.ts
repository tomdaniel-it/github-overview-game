import { default_settings } from './../DefaultSettings.js';
import Visualizable from "./Visualizable.js";
import Skyscraper from "./Terrain/Skyscraper.js";
import Biography from "../Biography.js";
import GitHubManager from "../GitHub/GitHubManager.js";
import Project from "../Project.js";
import Billboard from "./Terrain/Billboard.js";
import Button from "./Terrain/Button.js";

export default class TerrainBuilder {
    visualizableElements:Array<Visualizable>;
    skyscrapers:Array<Skyscraper>;

    constructor(){
        this.visualizableElements = new Array<Visualizable>();
        this.skyscrapers = new Array<Skyscraper>();
    }

    build(){
        this.skyscrapers.push(new Skyscraper());
        this.createBiographySkyscrapers();
        this.createProjectSkyscrapers();
        this.pushSkyscrapers();
    }

    pushSkyscrapers(){
        this.visualizableElements = this.visualizableElements.concat(this.skyscrapers);
    }

    getTerrainElements():Array<Visualizable>{
        return this.visualizableElements;
    }

    createBiographySkyscrapers(){
        default_settings.biographies.forEach(biographyItem => {
            let biography = new Biography(biographyItem.title);
            biography.setDescription(biographyItem.description);
            this.skyscrapers.push(new Skyscraper(this.getLastSkyscraper(),new Button(biography), new Billboard(biography)));
        });
    }

    createProjectSkyscrapers(){
        let manager = new GitHubManager();
        let projects:Array<Project> = manager.getProjects();
        projects.forEach(((value:Project)=>{
            this.skyscrapers.push(new Skyscraper(this.getLastSkyscraper(), new Button(value), new Billboard(value)));
        }).bind(this));
    }

    getLastSkyscraper():Skyscraper {
        return this.skyscrapers[this.skyscrapers.length-1];
    }
}