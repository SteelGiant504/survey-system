// js/results.js
document.addEventListener('DOMContentLoaded', async () => {
    const selectEl = document.getElementById('survey-select');
    const containerEl = document.getElementById('results-container');
    const downloadBtn = document.getElementById('download-btn');
    let currentOptionsData = [];

    try {
        // プルダウンにアンケート一覧をセット
        const { data: questions, error } = await supabaseClient
            .from('questions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        questions.forEach(q => {
            const option = document.createElement('option');
            option.value = q.id;
            option.textContent = q.title;
            selectEl.appendChild(option);
        });
    } catch (error) {
        console.error('質問の取得に失敗:', error);
        alert('データの読み込みに失敗しました: ' + error.message);
    }

    // プルダウン変更時に集計データを取得
    selectEl.addEventListener('change', async (e) => {
        const questionId = e.target.value;
        containerEl.innerHTML = '';
        currentOptionsData = [];

        if (!questionId) {
            downloadBtn.disabled = true;
            return;
        }

        try {
            // 選択肢と、紐づく回答数をまとめて取得
            const { data: options, error } = await supabaseClient
                .from('options')
                .select(`id, image_url, responses(id)`)
                .eq('question_id', questionId);

            if (error) throw error;

            options.forEach((opt, index) => {
                const voteCount = opt.responses ? opt.responses.length : 0;

                // 画面表示用の要素
                const div = document.createElement('div');
                div.className = 'image-option';
                div.style.cursor = 'default';

                const img = document.createElement('img');
                img.src = opt.image_url;

                const countEl = document.createElement('h3');
                countEl.textContent = `得票数: ${voteCount}票`;
                countEl.style.textAlign = 'center';
                countEl.style.margin = '10px 0';

                div.appendChild(img);
                div.appendChild(countEl);
                containerEl.appendChild(div);

                // Excel出力用のデータ保存
                currentOptionsData.push({
                    '選択肢': `画像 ${index + 1}`,
                    '得票数': voteCount,
                    '画像URL': opt.image_url
                });
            });

            downloadBtn.disabled = false;
        } catch (error) {
            console.error('集計データの取得に失敗:', error);
            alert('集計データの取得に失敗しました。');
        }
    });

    // エクセルダウンロード処理
    downloadBtn.addEventListener('click', () => {
        if (currentOptionsData.length === 0) return;

        try {
            const worksheet = XLSX.utils.json_to_sheet(currentOptionsData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "集計結果");
            
            const selectedTitle = selectEl.options[selectEl.selectedIndex].text;
            XLSX.writeFile(workbook, `集計_${selectedTitle}.xlsx`);
        } catch (err) {
            alert('エクセル出力中にエラーが発生しました。');
            console.error(err);
        }
    });
});

