// js/app.js
document.addEventListener('DOMContentLoaded', async () => {
    const listEl = document.getElementById('survey-list');

    try {
        // すべての質問を取得
        const { data: questions, error } = await supabaseClient
            .from('questions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (questions.length === 0) {
            listEl.innerHTML = '<p>現在アンケートはありません。</p>';
            return;
        }

        // 強制的に縦並びにするための改修
        questions.forEach(q => {
            const itemDiv = document.createElement('div');
            itemDiv.style.marginBottom = '10px'; // 下に余白を作る
            itemDiv.style.padding = '15px';
            itemDiv.style.backgroundColor = '#ecf0f1';
            itemDiv.style.borderRadius = '5px';
            itemDiv.style.border = '1px solid #bdc3c7';

            const link = document.createElement('a');
            link.href = `survey.html?id=${q.id}`;
            link.textContent = '📋 ' + q.title; // 箇条書きのアイコンをつける
            link.style.textDecoration = 'none';
            link.style.color = '#2c3e50';
            link.style.fontWeight = 'bold';
            link.style.display = 'block'; // 横並びを防ぐ

            itemDiv.appendChild(link);
            listEl.appendChild(itemDiv);
        });
    } catch (error) {
        console.error(error);
        listEl.innerHTML = '<p>データの読み込みに失敗しました。</p>';
    }
});

