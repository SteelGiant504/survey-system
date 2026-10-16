// js/survey.js
document.addEventListener('DOMContentLoaded', async () => {
    const titleEl = document.getElementById('question-title');
    const containerEl = document.getElementById('options-container');
    const messageEl = document.getElementById('message');

    // URLから対象のアンケートIDを取得
    const urlParams = new URLSearchParams(window.location.search);
    const questionId = urlParams.get('id');

    if (!questionId) {
        titleEl.textContent = 'アンケートが指定されていません。';
        return;
    }

    try {
        const { data: question, error: qError } = await supabaseClient
            .from('questions')
            .select('*')
            .eq('id', questionId)
            .single();

        if (qError) throw qError;
        titleEl.textContent = question.title;

        const { data: options, error: optError } = await supabaseClient
            .from('options')
            .select('*')
            .eq('question_id', questionId);

        if (optError) throw optError;

        options.forEach(option => {
            const div = document.createElement('div');
            div.className = 'image-option';

            const img = document.createElement('img');
            img.src = option.image_url;

            div.appendChild(img);
            containerEl.appendChild(div);

            // クリックで回答送信
            div.addEventListener('click', async () => {
                const { error: resError } = await supabaseClient
                    .from('responses')
                    .insert([{ option_id: option.id }]);

                if (resError) {
                    alert('送信エラー: ' + resError.message);
                } else {
                    containerEl.style.display = 'none';
                    messageEl.textContent = '回答ありがとうございました！';
                    messageEl.style.color = 'green';
                }
            });
        });
    } catch (error) {
        console.error(error);
        titleEl.textContent = 'データの読み込みに失敗しました。';
    }
});

