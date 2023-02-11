import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import path from "path";
import fs from "fs";
import { executeCli, generateOutput } from "../test.util";
import { IPackageInfo } from "../../src/configuration";

const fsMocked = jest.mocked(fs);
jest.spyOn(console, "warn").mockImplementation(() => {});

// Package info
const packageOne: IPackageInfo = {
    name: "first",
    url: "https://first.de",
    licenseName: "FIRST",
    licenseText: "LICENSE for first",
};
const packageTwo: IPackageInfo = {
    name: "second",
    url: "https://second.de",
    licenseName: "SECOND",
    licenseText: "LICENSE for second",
};

describe('Parameter "--ignore"', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("finds all packages by default", async () => {
        await executeCli("--root", __dirname);
        expect(fsMocked.writeFileSync).toBeCalledWith(
            path.resolve(__dirname, "3rdpartylicenses.json"),
            generateOutput(packageOne, packageTwo),
        );
    });

    it("ignores test folder", async () => {
        await executeCli("--root", __dirname, "--ignore", `${__dirname}/test/**`);
        expect(fsMocked.writeFileSync).toBeCalledWith(
            path.resolve(__dirname, "3rdpartylicenses.json"),
            generateOutput(packageOne),
        );
    });

    it("ignores node_modules folder", async () => {
        await executeCli("--root", __dirname, "--config", "test1.config");
        expect(fsMocked.writeFileSync).toBeCalledWith(
            path.resolve(__dirname, "3rdpartylicenses.json"),
            generateOutput(packageTwo),
        );
    });

    it("ignores both folders", async () => {
        await executeCli("--root", __dirname, "--config", "test2.config");
        expect(fsMocked.writeFileSync).toBeCalledWith(
            path.resolve(__dirname, "3rdpartylicenses.json"),
            generateOutput(),
        );
    });
});
