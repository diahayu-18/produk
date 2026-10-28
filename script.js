let keranjang = [];

function tambahKeKeranjang(namaMenu, hargaMenu) {
    let itemDitemukan = keranjang.find(item => item.nama === namaMenu);
    
    if (itemDitemukan) {
        itemDitemukan.jumlah += 1;
    } else {
        keranjang.push({ nama: namaMenu, harga: hargaMenu, jumlah: 1 });
    }
    
    updateTampilanKeranjang();
}

function updateTampilanKeranjang() {
    let containerKeranjang = document.getElementById("cart-items");
    
    if (keranjang.length === 0) {
        containerKeranjang.innerHTML = "Keranjang masih kosong.";
        return;
    }
    
    let htmlContent = "";
    let totalHarga = 0;
    
    keranjang.forEach(item => {
        let subtotal = item.harga * item.jumlah;
        totalHarga += subtotal;
        htmlContent += `<div>${item.nama} (${item.jumlah}x) - Rp${subtotal.toLocaleString('id-ID')}</div>`;
    });
    
    htmlContent += `<hr><strong>Total: Rp${totalHarga.toLocaleString('id-ID')}</strong>`;
    containerKeranjang.innerHTML = htmlContent;
}

function resetKeranjang() {
    keranjang = [];
    updateTampilanKeranjang();
}

function kirimWhatsApp(event) {
    event.preventDefault();
    
    let nama = document.getElementById("nama").value;
    let kelas = document.getElementById("kelas").value;
    let noWaInput = document.getElementById("wa").value;
    let catatan = document.getElementById("catatan").value;
    
    if (keranjang.length === 0) {
        alert("Keranjang masih kosong! Silakan pilih menu terlebih dahulu.");
        return;
    }
    
    let pesan = `Halo, saya ingin memesan:\n\nNama: ${nama}\nKelas: ${kelas}\n\n*Pesanan:*`;
    let totalHarga = 0;
    
    keranjang.forEach(item => {
        let subtotal = item.harga * item.jumlah;
        totalHarga += subtotal;
        pesan += `\n- ${item.nama} (${item.jumlah}x) : Rp${subtotal.toLocaleString('id-ID')}`;
    });
    
    pesan += `\n\n*Total Pembayaran: Rp${totalHarga.toLocaleString('id-ID')}*`;
    if (catatan) {
        pesan += `\nCatatan: ${catatan}`;
    }
    
    let urlWhatsApp = `https://wa.me/${noWaInput}?text=${encodeURIComponent(pesan)}`;
    window.open(urlWhatsApp, '_blank');
}
