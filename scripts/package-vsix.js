import { create_zip } from "./zip.js";
import { increment_patch_version } from "./version.js";

const build_process = Bun.spawn(["bun", "run", "build"], {
	stdin: "inherit",
	stdout: "inherit",
	stderr: "inherit",
});
const build_exit_code = await build_process.exited;
if (build_exit_code !== 0) {
	process.exit(build_exit_code);
}

const package_text = await Bun.file("package.json").text();
const package_data = JSON.parse(package_text);
const previous_version = package_data.version;
package_data.version = increment_patch_version(previous_version);
const updated_package_text = `${JSON.stringify(package_data, null, "\t")}\n`;
await Bun.write("package.json", updated_package_text);
const extension_id = `${package_data.publisher}.${package_data.name}`;
const vsix_name = `${package_data.name}-${package_data.version}.vsix`;

function escape_xml(value) {
	let escaped_value = value.replaceAll("&", "&amp;");
	escaped_value = escaped_value.replaceAll("<", "&lt;");
	escaped_value = escaped_value.replaceAll(">", "&gt;");
	escaped_value = escaped_value.replaceAll('"', "&quot;");
	return escaped_value;
}

const content_types = `<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="json" ContentType="application/json" />
  <Default Extension="js" ContentType="application/javascript" />
  <Default Extension="md" ContentType="text/markdown" />
  <Default Extension="png" ContentType="image/png" />
  <Default Extension="vsixmanifest" ContentType="text/xml" />
</Types>
`;

const vsix_manifest = `<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011">
  <Metadata>
    <Identity Language="en-US" Id="${escape_xml(package_data.name)}" Version="${escape_xml(package_data.version)}" Publisher="${escape_xml(package_data.publisher)}" />
    <DisplayName>${escape_xml(package_data.displayName)}</DisplayName>
    <Description xml:space="preserve">${escape_xml(package_data.description)}</Description>
    <Tags>${escape_xml(package_data.keywords.join(","))}</Tags>
    <Categories>${escape_xml(package_data.categories.join(","))}</Categories>
    <GalleryFlags>Public</GalleryFlags>
    <Properties>
      <Property Id="Microsoft.VisualStudio.Code.Engine" Value="${escape_xml(package_data.engines.vscode)}" />
      <Property Id="Microsoft.VisualStudio.Services.Links.Source" Value="${escape_xml(package_data.repository.url)}" />
      <Property Id="Microsoft.VisualStudio.Services.Links.Getstarted" Value="${escape_xml(package_data.homepage)}" />
      <Property Id="Microsoft.VisualStudio.Services.Links.Support" Value="${escape_xml(package_data.bugs.url)}" />
    </Properties>
    <Icon>extension/icon.png</Icon>
    <License>extension/LICENSE.md</License>
  </Metadata>
  <Installation>
    <InstallationTarget Id="Microsoft.VisualStudio.Code" />
  </Installation>
  <Dependencies />
  <Assets>
    <Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true" />
    <Asset Type="Microsoft.VisualStudio.Services.Content.Details" Path="extension/README.md" Addressable="true" />
    <Asset Type="Microsoft.VisualStudio.Services.Content.License" Path="extension/LICENSE.md" Addressable="true" />
    <Asset Type="Microsoft.VisualStudio.Services.Icons.Default" Path="extension/icon.png" Addressable="true" />
  </Assets>
</PackageManifest>
`;

const encoder = new TextEncoder();
const included_files = ["package.json", "README.md", "LICENSE.md", "icon.png", "dist/extension.js"];
const file_entries = [
	{ path: "[Content_Types].xml", bytes: encoder.encode(content_types) },
	{ path: "extension.vsixmanifest", bytes: encoder.encode(vsix_manifest) },
];

for (const included_file of included_files) {
	const file_bytes = await Bun.file(included_file).bytes();
	file_entries.push({ path: `extension/${included_file}`, bytes: file_bytes });
}

const vsix_bytes = create_zip(file_entries);
await Bun.write(vsix_name, vsix_bytes);
console.log(`Increased version from ${previous_version} to ${package_data.version}.`);
console.log(`Packaged ${extension_id} as ${vsix_name}`);
