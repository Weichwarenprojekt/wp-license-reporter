import { Command } from "commander";
import { reportLicenses } from "./reporter";
import { defaultConfiguration } from "./configuration";

const name =
    " __        ______    _     _                           ____                       _\n" +
    " \\ \\      / /  _ \\  | |   (_) ___ ___ _ __  ___  ___  |  _ \\ ___ _ __   ___  _ __| |_ ___ _ __\n" +
    "  \\ \\ /\\ / /| |_) | | |   | |/ __/ _ \\ '_ \\/ __|/ _ \\ | |_) / _ \\ '_ \\ / _ \\| '__| __/ _ \\ '__|\n" +
    "   \\ V  V / |  __/  | |___| | (_|  __/ | | \\__ \\  __/ |  _ <  __/ |_) | (_) | |  | ||  __/ |\n" +
    "    \\_/\\_/  |_|     |_____|_|\\___\\___|_| |_|___/\\___| |_| \\_\\___| .__/ \\___/|_|   \\__\\___|_|\n" +
    "                                                                |_|";
const program = new Command();

/**
 * Executes the cli
 * @param args The arguments for the cli
 */
export async function cli(args: string[]): Promise<void> {
    await program
        .version(process.env.npm_package_version ?? "0.0.0")
        .description(
            `${name}\nA tool that analyzes node modules and extracts the license information into a json file that can be used for rendering the third party software.`,
        )
        .action(reportLicenses)
        .option("--config <value>", "The path to the configuration file.", defaultConfiguration.config)
        .option("--force", "Forces a good exit.", defaultConfiguration.force)
        .option("--ignore <value>", "Ignores the given paths when searching for packages.", defaultConfiguration.ignore)
        .option("--output <value>", "The path to the output file.", defaultConfiguration.output)
        .option("--root <value>", "The path to the root directory.", defaultConfiguration.root)
        .option("--search <value>", 'The search mode. Can be "flat" or "recursive".', defaultConfiguration.search)
        .parseAsync(args);
}
