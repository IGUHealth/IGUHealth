import profiles from "@genfhi/artifacts/r4/profiles-types.json";
import { Command } from 'commander';

const program = new Command();
program
  .name('FHIR Code Generation')
  .description('CLI to generate code based off fhir artifacts.')
  .version('0.8.0');

program.command('generate-types')
  .description('Generates typescript types off profiles')
  .argument('<profiles...>', 'FHIR Version')
  .option('-v, --version <version>', 'FHIR Profiles to use', "r4")
  .action((profiles, options) => {
    console.log(profiles, options)
  });

program.parse();
