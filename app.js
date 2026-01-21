function searchData() {
    const keyword = document.getElementById("searchInput").value.trim();
    const details = document.getElementById("details");
    
    if (!keyword) {
        details.innerHTML = "<div class='alert alert-warning alert-custom'><i class='fas fa-exclamation-triangle'></i> Mohon masukkan nomor pengajuan</div>";
        return;
    }
    
    details.innerHTML = "<div class='loading'><div class='spinner'></div><p class='mt-3'>Mencari data...</p></div>";
    
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${window.SPREADSHEET_ID}/values/${window.RANGE}?key=${window.API_KEY}`)
        .then(res => res.json())
        .then(data => {
            const rows = data.values;
            let found = false;
            
            for (let i = 1; i < rows.length; i++) {
                if (rows[i][1] === keyword) {
                    found = true;
                    const resi = rows[i][8];
                    const wa = rows[i][7];
                    const hasResi = resi && resi !== "#N/A" && resi.trim() !== "";
                    
                    const message = encodeURIComponent(
                        `Halo, berikut informasi KTP Anda:\n\n` +
                        `Nama: ${rows[i][2]}\n` +
                        `Kode Pengajuan: ${rows[i][1]}\n` +
                        (hasResi ? `Resi POS: ${resi}` : `KTP masih proses cetak`)
                    );
                    
                    details.innerHTML = `
                        <div class="detail-item">
                            <div class="detail-label">Kode Pengajuan</div>
                            <div class="detail-value">${rows[i][1]}</div>
                        </div>
                        
                        <div class="detail-item">
                            <div class="detail-label">Nama Lengkap</div>
                            <div class="detail-value">${rows[i][2]}</div>
                        </div>
                        
                        <div class="detail-item">
                            <div class="detail-label">Alamat</div>
                            <div class="detail-value">
                                ${rows[i][4]}, Kec. ${rows[i][3]}<br>
                                RT/RW: ${rows[i][5]}/${rows[i][6]}
                            </div>
                        </div>
                        
                        <div class="detail-item">
                            <div class="detail-label">Nomor WhatsApp</div>
                            <div class="detail-value">
                                <a href="https://wa.me/62${wa}?text=${message}" target="_blank" class="wa-link">
                                    <i class="fab fa-whatsapp"></i> 0${wa}
                                </a>
                            </div>
                        </div>
                        
                        <div class="detail-item">
                            <div class="detail-label">Status Pengiriman</div>
                            <div class="detail-value">
                                ${
                                    hasResi
                                    ? `<span class="status-badge status-shipped"><i class="fas fa-shipping-fast"></i> Sedang Dikirim</span><br><br>
                                       <strong>Resi POS Indonesia:</strong><br>
                                       <a href="https://www.posindonesia.co.id/id/tracking/${resi}" target="_blank" class="tracking-link">
                                           <i class="fas fa-box"></i> ${resi}
                                       </a>`
                                    : `<span class="status-badge status-process"><i class="fas fa-clock"></i> Proses Cetak</span><br><br>
                                       <small>KTP Anda masih dalam proses pencetakan, untuk informasi lebih lanjut klik <a href="https://wa.me/6282328611600" target="_blank" class="wa-link">
                                    <i class="fab fa-whatsapp"></i> DISINI
                                </a> </small>`
                                }
                            </div>
                        </div>
                    `;
                    break;
                }
            }
            
            if (!found) {
                details.innerHTML = "<div class='alert alert-danger alert-custom'><i class='fas fa-times-circle'></i> Data tidak ditemukan. Periksa kembali nomor pengajuan Anda.</div>";
            }
        })
        .catch(() => {
            details.innerHTML = "<div class='alert alert-danger alert-custom'><i class='fas fa-exclamation-circle'></i> Gagal memuat data. Silakan coba lagi.</div>";
        });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchInput').focus();
    
    document.getElementById('searchBtn').addEventListener('click', searchData);
    
    document.getElementById('searchInput').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            searchData();
        }
    });
});