document.addEventListener('DOMContentLoaded', () => {
    // ⚠️ 注意: imageプロパティには、実際に 'assets/images/' フォルダに保存したファイル名を指定してください。
    // ファイル名がない場合は 'null' にしています。
    const KISO_DATA = [
        // あ行
        { hira: 'あ', kata: 'ア', word: 'あり', image: 'a_ari.png' },
        { hira: 'い', kata: 'イ', word: 'いぬ', image: 'i_inu.png' },
        { hira: 'う', kata: 'ウ', word: 'うま', image: 'u_uma.png' },
        { hira: 'え', kata: 'エ', word: 'えんぴつ', image: 'e_enpitsu.png' },
        { hira: 'お', kata: 'オ', word: 'おに', image: 'o_oni.png' },

        // か行
        { hira: 'か', kata: 'カ', word: 'かさ', image: 'ka_kasa.png' },
        { hira: 'き', kata: 'キ', word: 'きつね', image: 'ki_kitsune.png' },
        { hira: 'く', kata: 'ク', word: 'くま', image: 'ku_kuma.png' },
        { hira: 'け', kata: 'ケ', word: 'けむし', image: 'ke_kemushi.png' },
        { hira: 'こ', kata: 'コ', word: 'こあら', image: 'ko_koara.png' },
        
        // さ行
        { hira: 'さ', kata: 'サ', word: 'さかな', image: 'sa_sakana.png' },
        { hira: 'し', kata: 'シ', word: 'しか', image: 'shi_shika.png' },
        { hira: 'す', kata: 'ス', word: 'すいか', image: 'su_suika.png' },
        { hira: 'せ', kata: 'セ', word: 'せんす', image: 'se_sensu.png' },
        { hira: 'そ', kata: 'ソ', word: 'そら', image: 'so_sora.png' },

        // た行
        { hira: 'た', kata: 'タ', word: 'たまご', image: 'ta_tamago.png' },
        { hira: 'ち', kata: 'チ', word: 'ちず', image: 'chi_chizu.png' },
        { hira: 'つ', kata: 'ツ', word: 'つき', image: 'tsu_tsuki.png' },
        { hira: 'て', kata: 'テ', word: 'てぶくろ', image: 'te_tebukuro.png' },
        { hira: 'と', kata: 'ト', word: 'とけい', image: 'to_tokei.png' },

        // な行
        { hira: 'な', kata: 'ナ', word: 'なす', image: 'na_nasu.png' },
        { hira: 'に', kata: 'ニ', word: 'にわとり', image: 'ni_niwatori.png' },
        { hira: 'ぬ', kata: 'ヌ', word: 'ぬいぐるみ', image: 'nu_nuigurumi.png' },
        { hira: 'ね', kata: 'ネ', word: 'ねこ', image: 'ne_neko.png' },
        { hira: 'の', kata: 'ノ', word: 'のり', image: 'no_nori.png' },

        // は行
        { hira: 'は', kata: 'ハ', word: 'はし', image: 'ha_hashi.png' },
        { hira: 'ひ', kata: 'ヒ', word: 'ひつじ', image: 'hi_hitsuji.png' },
        { hira: 'ふ', kata: 'フ', word: 'ふうせん', image: 'fu_fuusen.png' },
        { hira: 'へ', kata: 'ヘ', word: 'へび', image: 'he_hebi.png' },
        { hira: 'ほ', kata: 'ホ', word: 'ほし', image: 'ho_hoshi.png' },

        // ま行
        { hira: 'ま', kata: 'マ', word: 'まくら', image: 'ma_makura.png' },
        { hira: 'み', kata: 'ミ', word: 'みかん', image: 'mi_mikan.png' },
        { hira: 'む', kata: 'ム', word: 'むし', image: 'mu_mushi.png' },
        { hira: 'め', kata: 'メ', word: 'めがね', image: 'me_megane.png' },
        { hira: 'も', kata: 'モ', word: 'もも', image: 'mo_momo.png' },

        // やゆよ行
        { hira: 'や', kata: 'ヤ', word: 'やかん', image: 'ya_yakan.png' },
        { hira: 'ゆ', kata: 'ユ', word: 'ゆきだるま', image: 'yu_yukidaruma.png' },
        { hira: 'よ', kata: 'ヨ', word: 'ようふく', image: 'yo_youfuku.png' },
        
        // らりるれろ行
        { hira: 'ら', kata: 'ラ', word: 'らっぱ', image: 'ra_rappa.png' },
        { hira: 'り', kata: 'リ', word: 'りんご', image: 'ri_ringo.png' },
        { hira: 'る', kata: 'ル', word: 'るすばん', image: 'ru_rusuban.png' },
        { hira: 'れ', kata: 'レ', word: 'れんこん', image: 're_renkon.png' },
        { hira: 'ろ', kata: 'ロ', word: 'ろうそく', image: 'ro_rousoku.png' },

        // わをん行
        { hira: 'わ', kata: 'ワ', word: 'わに', image: 'wa_wani.png' },
        { hira: 'を', kata: 'ヲ', word: 'なし', image: null }, // 「を」は通常、単語の頭には来ない
        { hira: 'ん', kata: 'ン', word: 'なし', image: null }
    ];

    const tbody = document.getElementById('kiso-tbody'); 
    
    if (tbody) {
        let html = '';
        KISO_DATA.forEach(item => {
            const imagePath = item.image ? `assets/images/${item.image}` : null;
            const wordDisplay = item.word && item.image ? `<br>(${item.word})` : '';

            html += `
                <tr>
                    <td class="char-hira">${item.hira}</td>
                    <td class="char-kata">${item.kata}</td>
                    <td class="char-illust">
                        ${imagePath ? `<img src="${imagePath}" alt="${item.word}" onerror="this.style.display='none'" class="kiso-illust">${wordDisplay}` : 'ー'}
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }
});