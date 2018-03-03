import Visualizable from "./Visualizable.js";
import Skyscraper from "./Terrain/Skyscraper.js";
import Biography from "../Biography.js";
import Crate from "./Terrain/Crate.js";
import GitHubManager from "../GitHub/GitHubManager.js";
import Project from "../Project.js";
import Billboard from "./Terrain/Billboard.js";

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
        let aboutMe = new Biography("About me");
        aboutMe.setDescription("I am an IT student lorum ipsum this is a place holder. This should also jump automatically to a new line so I'm just keeping on writing text until I think it's enough. I'm 20 years old (which should be generated from my birthdate so no automatic updates are needed!). Alright enough now. Now I'm just going to keep writing random text just to create some height in this so called 'textbox' which I had to create myself cause fillText() doesn't have a multiline feature FFS... But oh well, you gotta do what you gotta do I guess :)");
        this.skyscrapers.push(new Skyscraper(this.getLastSkyscraper(),new Crate(aboutMe), new Billboard(aboutMe)));

        let anotherOne = new Biography("Another BIO");
        anotherOne.setDescription("This is a short second biography. To be created...");
        this.skyscrapers.push(new Skyscraper(this.getLastSkyscraper(), new Crate(anotherOne), new Billboard(anotherOne)));
    }

    createProjectSkyscrapers(){
        let manager = new GitHubManager();
        let projects:Array<Project> = manager.getProjects();
        projects.forEach(((value:Project)=>{
            this.skyscrapers.push(new Skyscraper(this.getLastSkyscraper(), new Crate(value), new Billboard(value)));
        }).bind(this));
    }

    getLastSkyscraper():Skyscraper {
        return this.skyscrapers[this.skyscrapers.length-1];
    }
}