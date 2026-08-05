const crc_table = new Uint32Array(256);

for (let table_index = 0; table_index < 256; table_index += 1) {
	let crc_value = table_index;

	for (let bit_index = 0; bit_index < 8; bit_index += 1) {
		crc_value = (crc_value & 1) ? 0xedb88320 ^ (crc_value >>> 1) : crc_value >>> 1;
	}

	crc_table[table_index] = crc_value >>> 0;
}

function calculate_crc32(bytes) {
	let crc_value = 0xffffffff;

	for (const byte_value of bytes) {
		const table_index = (crc_value ^ byte_value) & 0xff;
		crc_value = crc_table[table_index] ^ (crc_value >>> 8);
	}

	return (crc_value ^ 0xffffffff) >>> 0;
}

function create_buffer(size) {
	const bytes = new Uint8Array(size);
	const data_view = new DataView(bytes.buffer);
	return { bytes, data_view };
}

function concatenate(parts) {
	let total_length = 0;
	for (const part of parts) {
		total_length += part.length;
	}

	const combined = new Uint8Array(total_length);
	let offset = 0;

	for (const part of parts) {
		combined.set(part, offset);
		offset += part.length;
	}

	return combined;
}

function get_dos_time(date_value) {
	const seconds = Math.floor(date_value.getSeconds() / 2);
	return (date_value.getHours() << 11) | (date_value.getMinutes() << 5) | seconds;
}

function get_dos_date(date_value) {
	const year = Math.max(date_value.getFullYear(), 1980) - 1980;
	return (year << 9) | ((date_value.getMonth() + 1) << 5) | date_value.getDate();
}

export function create_zip(file_entries) {
	const encoder = new TextEncoder();
	const local_parts = [];
	const central_parts = [];
	const archive_date = new Date();
	const dos_time = get_dos_time(archive_date);
	const dos_date = get_dos_date(archive_date);
	let local_offset = 0;

	for (const file_entry of file_entries) {
		const name_bytes = encoder.encode(file_entry.path);
		const content_bytes = file_entry.bytes;
		const crc32 = calculate_crc32(content_bytes);
		const local_buffer = create_buffer(30);
		const local_header = local_buffer.bytes;
		const local_view = local_buffer.data_view;
		local_view.setUint32(0, 0x04034b50, true);
		local_view.setUint16(4, 20, true);
		local_view.setUint16(6, 0x0800, true);
		local_view.setUint16(8, 0, true);
		local_view.setUint16(10, dos_time, true);
		local_view.setUint16(12, dos_date, true);
		local_view.setUint32(14, crc32, true);
		local_view.setUint32(18, content_bytes.length, true);
		local_view.setUint32(22, content_bytes.length, true);
		local_view.setUint16(26, name_bytes.length, true);
		local_view.setUint16(28, 0, true);
		local_parts.push(local_header, name_bytes, content_bytes);

		const central_buffer = create_buffer(46);
		const central_header = central_buffer.bytes;
		const central_view = central_buffer.data_view;
		central_view.setUint32(0, 0x02014b50, true);
		central_view.setUint16(4, 20, true);
		central_view.setUint16(6, 20, true);
		central_view.setUint16(8, 0x0800, true);
		central_view.setUint16(10, 0, true);
		central_view.setUint16(12, dos_time, true);
		central_view.setUint16(14, dos_date, true);
		central_view.setUint32(16, crc32, true);
		central_view.setUint32(20, content_bytes.length, true);
		central_view.setUint32(24, content_bytes.length, true);
		central_view.setUint16(28, name_bytes.length, true);
		central_view.setUint16(30, 0, true);
		central_view.setUint16(32, 0, true);
		central_view.setUint16(34, 0, true);
		central_view.setUint16(36, 0, true);
		central_view.setUint32(38, 0, true);
		central_view.setUint32(42, local_offset, true);
		central_parts.push(central_header, name_bytes);
		local_offset += local_header.length + name_bytes.length + content_bytes.length;
	}

	const local_data = concatenate(local_parts);
	const central_data = concatenate(central_parts);
	const end_buffer = create_buffer(22);
	const end_record = end_buffer.bytes;
	const end_view = end_buffer.data_view;
	end_view.setUint32(0, 0x06054b50, true);
	end_view.setUint16(4, 0, true);
	end_view.setUint16(6, 0, true);
	end_view.setUint16(8, file_entries.length, true);
	end_view.setUint16(10, file_entries.length, true);
	end_view.setUint32(12, central_data.length, true);
	end_view.setUint32(16, local_data.length, true);
	end_view.setUint16(20, 0, true);

	return concatenate([local_data, central_data, end_record]);
}
