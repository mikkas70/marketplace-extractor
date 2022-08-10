import delay from "./src/helpers/delay";
import Market from "./src/models/Market";
import {IMarketStructure} from "./src/interfaces/marketStructure";
import CHARACTERS from "./src/constants/characters";
import Tibia from "./src/models/Tibia";
import textract from 'textract';
import APIService from "./src/services/APIService";
import fs from "fs";
import FOLDERS from "./src/constants/folders";
import libnut from "@nut-tree/libnut";
import {getCroppedImage} from "./src/helpers/screenshot";

getCroppedImage('test.png', 100, 100, 200, 200);
