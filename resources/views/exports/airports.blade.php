<!DOCTYPE html>
<html>

<head>
    <title>Bandar Udara</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .footer {
            text-align: right;
            font-size: 10px;
            margin-top: 30px;
        }

        img {
            max-width: 60px;
            max-height: 60px;
        }
    </style>
</head>

<body>
    <div class="header">
        <h2>Laporan Bandar Udara</h2>
        @if ($search)
            <p>Hasil pencarian: "{{ $search }}"</p>
        @endif
        <p>Tanggal Export: {{ date('d/m/Y H:i:s') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama Bandara</th>
                <th>Kode Bandara</th>
                <th>Lokasi</th>
                <th>Deskripsi</th>
                <th>Link Website</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($airports as $index => $option)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $option->name }}</td>
                    <td>{{ $option->code }}</td>
                    <td>{{ $option->location }}</td>
                    <td>{{ $option->description ?? 'Tidak ada deskripsi' }}</td>
                    <td>{{ $option->link_website ?? 'Tidak ada link website' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Dicetak pada: {{ date('d/m/Y H:i:s') }}</p>
    </div>
</body>

</html>
