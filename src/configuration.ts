import { OptionValues } from "commander";
import path from "path";

/**
 * The possible search modes
 */
export enum SearchMode {
    /** Also searches in subdirectories */
    recursive = "recursive",
    /** Only searches in the root directory */
    flat = "flat",
}

/**
 * The package information for a single package
 */
export interface IPackageInfo {
    /** The name of the package */
    name: string;
    /** The url to the homepage/repo of the package */
    url: string;
    /** The name of the license */
    licenseName: string;
    /** The license text */
    licenseText: string;
}

/**
 * The parameters that can be configured within the configuration file
 */
export interface IReporterConfiguration {
    /** Forces a good exit. */
    force: boolean;
    /** Ignores the given paths when searching for packages */
    ignore: string | string[] | undefined;
    /** The path to the output file */
    output: string;
    /** The overrides for single packages */
    overrides: Partial<IPackageInfo>[];
    /** The path to the root directory */
    root: string;
    /** The search mode. Can be "flat" or "search" */
    search: SearchMode;
}

/**
 * The parameters of the cli
 */
export interface IReporterCliConfiguration extends IReporterConfiguration {
    /** The path to the configuration file */
    config: string;
}

/**
 * The default configuration
 */
export const defaultConfiguration: IReporterCliConfiguration = {
    config: `./license-reporter.config`,
    force: false,
    ignore: undefined,
    output: `./3rdpartylicenses.json`,
    overrides: [],
    root: process.cwd(),
    search: SearchMode.recursive,
};

/**
 * Loads the configuration file
 * @param options The configuration parameters that were collected by commander
 */
export async function loadConfiguration(options: OptionValues): Promise<IReporterConfiguration> {
    const cliConfig = Object.assign(defaultConfiguration, options);
    try {
        let configPath = cliConfig.config;
        if (!path.isAbsolute(configPath)) configPath = path.resolve(cliConfig.root, configPath);
        const configImport = await import(configPath);
        if (!configImport.configuration) console.warn('The specified configuration does not export a "configuration"');
        return Object.assign(cliConfig, configImport.configuration);
    } catch (e) {
        console.warn("Could not find a configuration file!");
        return cliConfig;
    }
}
