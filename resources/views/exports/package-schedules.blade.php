<!DOCTYPE html>
<html>

<head>
    <title>Paket Umrah</title>
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
        <h2>Laporan Paket Umrah</h2>
        @if ($search)
            <p>Hasil pencarian: "{{ $search }}"</p>
        @endif
        <p>Tanggal Export: {{ date('d/m/Y H:i:s') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama Paket</th>
                <th>Hotel Makkah</th>
                <th>Hotel Madinah</th>
                <th>Airport</th>
                <th>Airline</th>
                <th>Tanggal Keberangkatan</th>
                <th>Harga</th>
                <th>Sisa Seat</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($packageSchedule as $index => $option)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $option->package->title ?? 'Tidak ada paket' }}</td>
                    <td>{{ $option->hotelMakkah->name ?? 'Tidak ada hotel' }}</td>
                    <td>{{ $option->hotelMadinah->name ?? 'Tidak ada hotel' }}</td>
                    <td>{{ $option->airport->name ?? 'Tidak ada bandar udara' }}</td>
                    <td>{{ $option->airline->name ?? 'Tidak ada maskapai' }}</td>
                    <td>{{ $option->departure_date ?? 'Tidak ada tanggal' }}</td>
                    <td>{{ $option->price ?? 'Tidak ada harga' }}</td>
                    <td>{{ $option->seat_available ?? 'Tidak ada seat' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Dicetak pada: {{ date('d/m/Y H:i:s') }}</p>
    </div>
</body>

</html>
